import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  InferSubjects,
  ExtractSubjectType,
  ForbiddenError,
} from '@casl/ability';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Friendship } from '../relationships/entities/friendship.entity';
import { Block } from '../relationships/entities/block.entity';
import { Achievement } from '../achievements/entities/achievements.entity';
import { AchievementsLog } from 'src/achievements-log/entities/achievements-log.entity';
import { Match } from '../matches/entities/match.entity';

export { User, Friendship, Block, Achievement, Match, AchievementsLog };

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
  | InferSubjects<typeof Achievement>
  | InferSubjects<typeof AchievementsLog>
  | InferSubjects<typeof Match>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private readonly friendshipsRepository: Repository<Friendship>,
    @InjectRepository(Block)
    private readonly blocksRepository: Repository<Block>,
    @InjectRepository(Achievement)
    private readonly achievementsRepository: Repository<Achievement>,
    @InjectRepository(AchievementsLog)
    private readonly achievementsLogRepository: Repository<Achievement>,
    @InjectRepository(Match)
    private readonly matchesRepository: Repository<Achievement>,
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

    can(Action.Update, User, { id: user.id });
    cannot(Action.Update, User, { id: { $ne: user.id } }).because(
      'You cannot update another user',
    );
    can(Action.Delete, User, { id: user.id });
    cannot(Action.Update, User, { id: { $ne: user.id } }).because(
      'You cannot delete another user',
    );

    // Friendships
    can(Action.Read, Friendship);

    // Blocks
    can(Action.Read, Block);

    // Achievement
    can(Action.Read, Achievement);

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  private getRepository(subject: Subjects) {
    switch (subject) {
      case User:
        return this.usersRepository;
      case Friendship:
        return this.friendshipsRepository;
      case Block:
        return this.blocksRepository;
      case Achievement:
        return this.achievementsRepository;
      case AchievementsLog:
        return this.achievementsLogRepository;
      case Match:
        return this.matchesRepository;
      default:
        console.error('No repository found for subject', subject);
    }
  }

  //async checkAbilityFromComplexCondition(
  //source: User,
  //action: Action,
  //subject: Subjects,
  //hint?: FindManyOptions<MyEntity>,
  //) {}

  async checkAbility(
    source: User,
    action: Action,
    subject: Subjects,
    hint?: FindOptionsWhere<unknown>,
    //hint?: FindManyOptions<unknown> | FindOptionsWhere<unknown>,
    //conditionType: ConditionType = ConditionType.FindOptionsWhere,
  ) {
    if (hint) {
      const repository = this.getRepository(subject);
      try {
        subject = await repository.findOneByOrFail(hint);
        //if (conditionType === ConditionType.FindManyOptions) {
        //subject = await repository.find(hint as FindManyOptions<unknown>);
      } catch {
        throw new ForbiddenException();
      }
    }
    const ability = this.createForUser(source);
    ForbiddenError.from(ability).throwUnlessCan(action, subject);
  }
}

interface MyEntity {
  id: number;
  targetId: number;
  sourceId: number;
  status: string;
}

export enum ConditionType {
  FindManyOptions = 'FindManyOptions',
  FindOptionsWhere = 'FindOptionsWhere',
}
