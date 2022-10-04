import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  ExtractSubjectType,
  ForbiddenError,
} from '@casl/ability';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Friendship } from '../relationships/entities/friendship.entity';
import { Block } from '../relationships/entities/block.entity';
import { Channel } from '../channels/entities/channel.entity';
import { Membership } from '../memberships/entities/membership.entity';
import { Message } from '../messages/entities/message.entity';
import { Achievement } from '../achievements/entities/achievements.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Match } from '../matches/entities/match.entity';

export {
  User,
  Friendship,
  Block,
  Channel,
  Membership,
  Message,
  Achievement,
  AchievementsLog,
  Match,
};

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export type Subjects =
  | InferSubjects<typeof User>
  | InferSubjects<typeof Friendship>
  | InferSubjects<typeof Block>
  | InferSubjects<typeof Channel>
  | InferSubjects<typeof Membership>
  | InferSubjects<typeof Message>
  | InferSubjects<typeof Achievement>
  | InferSubjects<typeof AchievementsLog>
  | InferSubjects<typeof Match>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private readonly friendshipsRepository: Repository<Friendship>,
    @InjectRepository(Block)
    private readonly blocksRepository: Repository<Block>,
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    @InjectRepository(Membership)
    private readonly membershipsRepository: Repository<Membership>,
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(AchievementsLog)
    private readonly achievementsLogRepository: Repository<AchievementsLog>,
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Match>,
  ) {}

  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<AppAbility>,
    );

    // Users
    if (process.env.DISABLE_AUTHENTICATION === 'false') {
      cannot(Action.Create, User).because(
        'User can only be created when authenticating with 42',
      );
    } else {
      // For testing purposes:
      can(Action.Create, User);
    }
    can(Action.Read, User);
    [Action.Update, Action.Delete].forEach((action: Action) => {
      can(action, User, { id: user.id });
      cannot(action, User, { id: { $ne: user.id } }).because(
        `You cannot ${action} another user`,
      );
    });

    // Friendships and blocks
    // TODO: if one is the target of the block, they cannot read it (see (see user.service)
    [Friendship, Block].forEach((entity) => {
      [Action.Read, Action.Delete].forEach((action) => {
        can(action, entity, { sourceId: user.id });
        can(action, entity, { targetId: user.id });
      });
      can(Action.Create, entity); // Complex condition left to the controller
    });
    can(Action.Update, Friendship, { targetId: user.id });
    cannot(Action.Update, Friendship, { targetId: { $ne: user.id } }).because(
      'You cannot update a friendship that is not destined to you',
    );
    // TODO: see user.service for blocks

    // Channels - TODO

    // Memberships - TODO

    // Messages - complex conditions left to the controller
    can(Action.Manage, Message);

    // Achievement and AchievementsLog
    [Achievement, AchievementsLog].forEach((entity) => {
      can(Action.Read, entity);
      [Action.Create, Action.Update, Action.Delete].forEach((action) => {
        cannot(action, entity);
      });
    });

    // Match
    can(Action.Read, Match);
    [Action.Create, Action.Update, Action.Delete].forEach((action) => {
      cannot(action, Match);
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  #allEntities: Subjects[] = [
    User,
    Friendship,
    Block,
    Channel,
    Achievement,
    Message,
    AchievementsLog,
    Membership,
    Match,
  ];

  private getRepository(subject: Subjects) {
    switch (subject) {
      case User:
        return this.usersRepository;
      case Friendship:
        return this.friendshipsRepository;
      case Block:
        return this.blocksRepository;
      case Channel:
        return this.channelsRepository;
      case Achievement:
        return this.achievementsRepository;
      case AchievementsLog:
        return this.achievementsLogRepository;
      case Message:
        return this.messagesRepository;
      case Membership:
        return this.membershipsRepository;
      case Match:
        return this.matchesRepository;
      default:
        console.error('No repository found for subject', subject);
    }
  }

  async checkAbility(
    source: User,
    action: Action,
    subject: Subjects,
    hint?: FindOptionsWhere<unknown>,
    condition?: (source: User, subject: Subjects) => Promise<boolean>,
  ) {
    if (hint !== undefined) {
      const repository = this.getRepository(subject);
      try {
        subject = await repository.findOneByOrFail(hint);
      } catch {
        throw new ForbiddenException();
      }
    }
    if (
      !this.#allEntities.includes(subject) &&
      condition &&
      !condition(source, subject)
    ) {
      throw new ForbiddenException();
    }
    const ability = this.createForUser(source);
    ForbiddenError.from(ability).throwUnlessCan(action, subject);
  }
}
