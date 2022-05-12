import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';

export enum RelationshipTypeEnum {
  FRIEND = 'friend',
  BLOCK = 'block',
}

@Unique(['source', 'target'])
@Entity()
@Check(`"sourceId" != "targetId"`)
export class Relationship {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToOne(() => User)
  source: User;
  @RelationId((relationship: Relationship) => relationship.source)
  sourceId: number;

  @Exclude()
  @ManyToOne(() => User)
  target: User;
  @RelationId((relationship: Relationship) => relationship.target)
  targetId: number;

  @Column({
    type: 'enum',
    enum: RelationshipTypeEnum,
    default: RelationshipTypeEnum.FRIEND,
  })
  type: RelationshipTypeEnum;
}
