import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Offer } from 'src/offers/offer.entity';
import { Challenge } from 'src/nft-challenge/challenges/challenge.entity';
import { Transaction } from 'src/transactions/transaction.entity';
import { Comment } from 'src/comments/comment.entity';

@Entity()
export class Nft {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  file: string;

  @Column({
    default: 'https://yaaas-test.s3-us-east-2.amazonaws.com/logo_white.png',
  })
  cover: string;

  @Column({ default: '' })
  type: string;

  @Column({ default: '' })
  expiry: string;

  @Column({ default: '' })
  assetId: string;

  @Column({ default: '' })
  uri: string;

  @Column({ default: '' })
  contractType: string;

  @Column({ default: '' })
  collection: string;

  @Column({ default: true })
  isEther: boolean;

  @Column({ default: false })
  isforSell: boolean;

  @Column({ default: false })
  isforAuction: boolean;

  @Column({ default: '' })
  holder: string;

  @Column({ default: '' })
  creator: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  sold: number;

  @Column({ default: 0 })
  supply: number;

  @Column({ default: 0 })
  totalSupply: number;

  @Column({ default: 0 })
  totalCommentCount: number;

  @Column({ default: 1 })
  shareIndex: number;

  @Column({ default: 1 })
  status: number;

  @Column({ default: '' })
  lockedData: string;

  @Column({ default: '' })
  nftType: string;

  @Column({ default: '', nullable: true })
  collabStart: string;

  @Column({ default: '', nullable: true })
  collabEnd: string;

  @Column({ default: false, nullable: true })
  resale: boolean;

  @Column({ default: false })
  airdropped: boolean;

  @Column({ default: '', nullable: true })
  collectionType: string;

  @Column({ default: '', nullable: true })
  externalLink: string;

  @Column({ default: '', nullable: true })
  dFile: string;

  @Column({ default: '', nullable: true })
  instagramUrl: string;

  @Column({ default: '', nullable: true })
  resaleCurrency: string;

  @Column({ default: '', nullable: true })
  loyaltyPercentage: string;

  @Column({ default: '', nullable: true })
  eventOrganizer: string;

  @Column({ default: '', nullable: true })
  eventType: string;

  @Column({ default: '', nullable: true })
  eventMode: string;

  @Column({ default: '', nullable: true })
  eventVenue: string;

  @Column({ default: '', nullable: true })
  eventConferenceLink: string;

  @Column({ default: '', nullable: true })
  eventStartTime: string;

  @Column({ default: '', nullable: true })
  eventEndTime: string;

  @Column({ default: '', nullable: true })
  eventUnblockContent: string;

  @Column({ default: '', nullable: true })
  fileType: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  chain_id: number;

  @Column({ type: 'float', default: 0, nullable: true })
  totalTradingAmount: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Offer, (offer) => offer.nft)
  offers: Offer[];

  @OneToMany((type) => Comment, (comment) => comment.nft)
  comments: Comment[];

  @OneToMany((type) => Challenge, (challenge) => challenge.nft)
  challenges: Challenge[];

  @OneToMany((type) => Transaction, (transaction) => transaction.nft)
  transactions: Transaction[];
}
