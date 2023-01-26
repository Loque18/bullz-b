import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Challenge } from '../challenges/challenge.entity';
import { User } from 'src/users/users.entity';
import { STATUS } from './submits.constants';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Submit {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  link: string;

  @ApiProperty()
  @Column()
  linkPreview: string;

  @ApiProperty()
  @Column({ default: false })
  hasWin: boolean;

  @ApiProperty()
  @Column({ default: STATUS.PENDING })
  status: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  checkingTime: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  airdropTime: number;

  @ApiProperty()
  @Column({ default: '' })
  txHash: string;

  @ApiProperty()
  @Column({ default: '' })
  failedMessage: string;

  @ManyToOne((type) => Challenge, (challenge) => challenge.submits, {
    onDelete: 'CASCADE',
  })
  challenge: Challenge;

  @ManyToOne((type) => User, (user) => user.submits, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
