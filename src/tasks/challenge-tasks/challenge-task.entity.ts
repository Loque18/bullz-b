import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { Challenge } from 'src/nft-challenge/challenges/challenge.entity';
import { TaskTemplate } from '../task-templates/task-template.entity';
import { SubmitTask } from '../submit-tasks/submit-task.entity';

@Entity()
export class ChallengeTask {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ default: '' })
  description: string;

  @ApiProperty()
  @Column({ default: false })
  is_template_checked: boolean;

  @ApiProperty()
  @Column({ default: '' })
  template_text: string;

  @ApiProperty()
  @Column({ default: '' })
  url_text: string;

  @ApiProperty()
  @Column({ default: false })
  is_private: boolean;

  @ApiProperty()
  @Column({ default: '' })
  second_text: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.challenge_tasks, {
    onDelete: 'CASCADE',
  })
  creator: User;

  @ManyToOne(() => Challenge, (challenge) => challenge.challenge_tasks, {
    onDelete: 'CASCADE',
  })
  challenge: Challenge;

  @ManyToOne(
    () => TaskTemplate,
    (taskTemplate) => taskTemplate.challenge_tasks,
    { onDelete: 'CASCADE' },
  )
  task_template: TaskTemplate;

  @OneToMany((type) => SubmitTask, (submit_task) => submit_task.challenge_task)
  submit_tasks: SubmitTask[];
}
