import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bid } from 'src/bids/bid.entity';
import { Nft } from 'src/nfts/nft.entity';
import { Transaction } from 'src/transactions/transaction.entity';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: false })
  offer_id: string;

  @Column()
  seller: string;

  @Column()
  collection: string;

  @Column()
  assetId: string;

  @Column()
  token: string;

  @Column()
  isEther: boolean;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column({ type: 'float', default: 0 })
  auctionStartTime: number;

  @Column()
  isForSell: boolean;

  @Column()
  isForAuction: boolean;

  @Column({ type: 'float', default: 0 })
  expiresAt: number;

  //addition here
  @Column({ nullable: true })
  currency: string;

  @Column()
  isSold: boolean;

  @Column({ nullable: true })
  supply: number;

  @Column({ default: 1 })
  shareIndex: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany((type) => Bid, (bid) => bid.offer)
  bids: Bid[];

  @ManyToOne((type) => Nft, (nft) => nft.offers, { onDelete: 'CASCADE' })
  nft: Nft;

  @OneToMany((type) => Transaction, (transaction) => transaction.nft)
  transactions: Transaction[];
}
