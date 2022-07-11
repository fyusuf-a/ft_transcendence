import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Action } from './actions';

type Subjects = InferSubjects<typeof User | typeof String> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private configService: ConfigService) {}
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (this.configService.get<string>('DISABLE_AUTHENTICATION') === 'true') {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
      can(Action.Update, User, { id: user.id });
      cannot(Action.Create, User);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
