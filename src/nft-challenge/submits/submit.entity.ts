import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Challenge } from '../challenges/challenge.entity';
import { User } from 'src/users/users.entity';
import { STATUS } from './submits.constants';
import { ApiProperty } from '@nestjs/swagger';
import { SubmitTask } from 'src/tasks/submit-tasks/submit-task.entity';

@Entity()
export class Submit {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ default: '' })
  link: string;

  @ApiProperty()
  @Column({ default: '' })
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

  @OneToMany((type) => SubmitTask, (submit_task) => submit_task.submit)
  submit_tasks: SubmitTask[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
