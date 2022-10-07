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

@Unique(['source', 'target'])
@Entity()
@Check(`"sourceId" != "targetId"`)
export class Block {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  source: User;
  @Column()
  @RelationId((block: Block) => block.source)
  sourceId: number;

  @Exclude()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  target: User;
  @Column()
  @RelationId((block: Block) => block.target)
  targetId: number;
}
