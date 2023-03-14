import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { TaskTemplate } from '../task-templates/task-template.entity';
import { ChallengeTask } from '../challenge-tasks/challenge-task.entity';
import { Submit } from 'src/nft-challenge/submits/submit.entity';

@Entity()
export class SubmitTask {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ default: '' })
  file_url: string;

  @ApiProperty()
  @Column({ default: '' })
  external_url: string;

  @ApiProperty()
  @Column({ default: false })
  isVerified: boolean;

  @ApiProperty()
  @Column({ default: true })
  isStartClicked: boolean;

  @ApiProperty()
  @Column({ default: '' })
  answer_text: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.submit_tasks, {
    onDelete: 'CASCADE',
  })
  submitted_by: User;

  @ManyToOne(
    () => ChallengeTask,
    (challengeTask) => challengeTask.submit_tasks,
    {
      onDelete: 'CASCADE',
    },
  )
  challenge_task: ChallengeTask;

  @ManyToOne(() => Submit, (submit) => submit.submit_tasks, {
    onDelete: 'CASCADE',
  })
  submit: Submit;
}
