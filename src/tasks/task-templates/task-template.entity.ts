import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ChallengeTask } from '../challenge-tasks/challenge-task.entity';

@Entity()
export class TaskTemplate {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  social_name: string;

  @ApiProperty()
  @Column({ nullable: true })
  identifier: string;

  @ApiProperty()
  @Column()
  task_name: string;

  @ApiProperty()
  @Column()
  button_title_header: string;

  @ApiProperty()
  @Column('text', { array: true })
  button_titles: string[];

  @ApiProperty()
  @Column()
  is_url: boolean;

  @ApiProperty()
  @Column()
  is_description: boolean;

  @ApiProperty()
  @Column()
  is_template: boolean;

  @ApiProperty()
  @Column()
  url_header: string;

  @ApiProperty()
  @Column()
  description_header: string;

  @ApiProperty()
  @Column()
  template_header: string;

  @ApiProperty()
  @Column()
  url_placeholder: string;

  @ApiProperty()
  @Column()
  description_placeholder: string;

  @ApiProperty()
  @Column()
  template_placeholder: string;

  @ApiProperty()
  @Column()
  info_text: string;

  @ApiProperty()
  @Column()
  is_file_needed: boolean;

  @ApiProperty()
  @Column()
  is_url_needed: boolean;

  @ApiProperty()
  @Column()
  is_internal: boolean;

  @ApiProperty()
  @Column()
  is_private_public: boolean;

  @ApiProperty()
  @Column()
  is_second_url: boolean;

  @ApiProperty()
  @Column()
  second_url_header: string;

  @ApiProperty()
  @Column()
  second_url_placeholder: string;

  @OneToMany(
    () => ChallengeTask,
    (challenge_task) => challenge_task.task_template,
  )
  challenge_tasks: ChallengeTask[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({ default: '' })
  submit_card_title: string;

  @ApiProperty()
  @Column({ default: '' })
  submit_card_button_text: string;
}
