import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Like } from 'src/likes/like.entity';
import { Submit } from 'src/nft-challenge/submits/submit.entity';
import { Challenge } from 'src/nft-challenge/challenges/challenge.entity';
import { Collection } from 'src/collection/collection.entity';
import { ChallengeTask } from 'src/tasks/challenge-tasks/challenge-task.entity';
import { SubmitTask } from 'src/tasks/submit-tasks/submit-task.entity';
@Entity()
@Unique(['address'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: false })
  address: string;

  @Column({ default: Math.random() }) // to do: add big secure number
  nonce: string;

  @Column({ default: '' })
  firstname: string;

  @Column({ default: '' })
  lastname: string;

  @Column({ default: '' })
  username: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: 0 })
  createdNFTCount: number;

  @Column({ default: 0 })
  ownedNFTCount: number;

  @Column({ default: '' })
  bio: string;

  @Column({
    default: 'https://yaaas-test.s3-us-east-2.amazonaws.com/logo_white.png',
  })
  avatar_img: string;

  @Column({
    default: 'https://yaaas-test.s3-us-east-2.amazonaws.com/logo_white.png',
  })
  back_img: string;

  @Column({ default: 'https://www.youtube.com/' })
  youtube_url: string;

  @Column({ default: 'https://twitch.tv/' })
  twitch_url: string;

  @Column({ default: 'https://linkedin.com/' })
  linkedin_url: string;

  @Column({ default: 'https://facebook.com/' })
  facebook_url: string;

  @Column({ default: 'https://twitter.com/' })
  twitter_url: string;

  @Column({ default: 'https://www.tiktok.com/' })
  tiktok_url: string;

  @Column({ default: 'https://www.instagram.com/' })
  instagram_url: string;

  @Column({ default: '' })
  discord_url: string;

  @Column({ default: '' })
  telegram_url: string;

  @Column({ default: '', nullable: true })
  url: string;

  @Column({ default: '' })
  portfolio_url: string;

  @Column({ type: 'float', default: 0, nullable: true })
  totalSold: number;

  @Column({ type: 'float', default: 0, nullable: true })
  totalBought: number;

  @Column('text', { array: true, default: [] })
  following: string[];

  @Column('text', { array: true, default: [] })
  follower: string[];

  @OneToMany((type) => Like, (like) => like.user)
  likes: Like[];

  @OneToMany((type) => Submit, (submit) => submit.user)
  submits: Submit[];

  @OneToMany((type) => Challenge, (challenge) => challenge.creator)
  challenges: Challenge[];

  @OneToMany((type) => Collection, (collection) => collection.user)
  collection: Collection[];

  @OneToMany(
    (type) => ChallengeTask,
    (challenge_task) => challenge_task.creator,
  )
  challenge_tasks: ChallengeTask[];

  @OneToMany((type) => SubmitTask, (submit_task) => submit_task.submitted_by)
  submit_tasks: SubmitTask[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
