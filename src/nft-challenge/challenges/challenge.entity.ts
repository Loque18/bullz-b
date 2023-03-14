import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Submit } from 'src/nft-challenge/submits/submit.entity';
import { Nft } from 'src/nfts/nft.entity';
import { Token } from 'src/tokens/token.entity';
import { User } from 'src/users/users.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CHALLENGE_STATUS } from './challenge.constant';
import { Spotlight } from 'src/spotlight/spotlight.entity';
import { Transaction } from 'src/transactions/transaction.entity';
import { ChallengeTask } from 'src/tasks/challenge-tasks/challenge-task.entity';

@Entity()
export class Challenge {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ nullable: false })
  challengeId: string; // from smart contracts

  @ApiProperty()
  @Column({ default: '' })
  name: string;

  @ApiProperty()
  @Column({ default: '' })
  description: string;

  @ApiProperty()
  @Column({ default: '' })
  websiteurl: string;

  @ApiProperty()
  @Column({ default: '' })
  file: string;

  @ApiProperty()
  @Column({
    default: 'https://yaaas-test.s3-us-east-2.amazonaws.com/logo_white.png',
  })
  cover: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  airdropFee: number;

  @ApiProperty()
  @Column({ default: 0 })
  submissionLimit: number;

  @ApiProperty()
  @Column({ default: false })
  isInstagram: boolean;

  @ApiProperty()
  @Column({ default: false })
  isTwitter: boolean;

  @ApiProperty()
  @Column({ default: false })
  isYoutube: boolean;

  @ApiProperty()
  @Column({ default: false })
  isTwitch: boolean;

  @ApiProperty()
  @Column({ default: false })
  isTiktok: boolean;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  airdropStartAt: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  airdropEndAt: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  challengeStartAt: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  expiresAt: number;

  @ApiProperty()
  @Column({ default: CHALLENGE_STATUS.ACTIVE })
  status: number;

  @Column({ default: 1 })
  hidden_status: number;

  @ApiProperty()
  @Column({ default: 0 })
  chain_id: number;

  @ApiProperty() //NFT = 1, Token = 2
  @Column({ default: 1 })
  asset_type: number;

  //Start For NFT type
  @ApiProperty() //NFT contract address
  @Column({ default: '' })
  collection: string;

  @ApiProperty() //NFT token id
  @Column({ default: '' })
  assetId: string;

  @ApiProperty()
  @Column({ default: false })
  allowResell: boolean;

  @ApiProperty()
  @Column({ default: 0 })
  amountToAirdrop: number;
  //end For NFT type

  //Start For Token type
  @ApiProperty() //erc20 Token address
  @Column({ default: '' })
  tokenAddress: string;

  @ApiProperty() //erc20 number of winners
  @Column({ default: 0 })
  winnerCount: number;

  @ApiProperty() //erc20 token amount for a winner
  @Column({ type: 'float', default: 0 })
  tokenAmount: number;
  //End For Token type

  @ManyToOne((type) => User, (user) => user.challenges, { onDelete: 'CASCADE' })
  creator: User;

  @OneToMany((type) => Submit, (submit) => submit.challenge)
  submits: Submit[];

  @ManyToOne((type) => Nft, (nft) => nft.challenges, { onDelete: 'CASCADE' })
  nft: Nft;

  @ManyToOne((type) => Token, (token) => token.challenges, {
    onDelete: 'CASCADE',
  })
  token: Token;

  @OneToMany((type) => Spotlight, (spotlight) => spotlight.challenge)
  spotlights: Spotlight[];

  @OneToMany((type) => Transaction, (transaction) => transaction.challenge)
  transactions: Transaction[];

  @OneToMany(
    (type) => ChallengeTask,
    (challenge_task) => challenge_task.challenge,
  )
  challenge_tasks: ChallengeTask[];

  @ApiProperty()
  @Column({ default: 0 })
  totalCommentCount: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
