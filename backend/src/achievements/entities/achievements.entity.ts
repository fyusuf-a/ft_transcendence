import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  description: string;

  @Column({
    type: 'bytea',
    nullable: true,
    default: null,
  })
  icon: Uint8Array;
}
