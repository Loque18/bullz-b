import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
@Unique(['address', 'type', 'chain_id'])
export class Collection {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  symbol: string;

  @ApiProperty()
  @Column()
  image: string;

  @ApiProperty()
  @Column({ nullable: true })
  coverImage: string;

  @ApiProperty()
  @Column()
  type: string;

  @ApiProperty()
  @Column({ nullable: true })
  coverFileType: string;

  @ApiProperty()
  @Column({ default: 0 })
  chain_id: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0, nullable: true })
  totalVolume: number;

  @ManyToOne((type) => User, (user) => user.collection, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
