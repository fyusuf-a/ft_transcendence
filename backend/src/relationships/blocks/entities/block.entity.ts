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

export enum BlockTypeEnum {
  T_BLOCKS_S = 1,
  S_BLOCKS_T = 2,
  MUTUAL = 3,
}

@Unique(['source', 'target'])
@Entity()
@Check(`"sourceId" != "targetId"`)
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToOne(() => User)
  source: User;
  @RelationId((block: Block) => block.source)
  sourceId: number;

  @Exclude()
  @ManyToOne(() => User)
  target: User;
  @RelationId((block: Block) => block.target)
  targetId: number;

  @Column({
    type: 'enum',
    enum: BlockTypeEnum,
    default: BlockTypeEnum.T_BLOCKS_S,
  })
  status: BlockTypeEnum;
}
