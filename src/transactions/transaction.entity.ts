import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Offer } from 'src/offers/offer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Challenge } from 'src/nft-challenge/challenges/challenge.entity';
import { Nft } from 'src/nfts/nft.entity';

@Entity()
export class Transaction {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  hash: string;

  @ApiProperty()
  @Column()
  purpose: string; //(airdrop, direct_sale, accept_bid)

  @ApiProperty()
  @Column({ default: 0 })
  chain_id: number;

  @ApiProperty()
  @Column()
  from: string;

  @ApiProperty()
  @Column()
  to: string;

  @ApiProperty()
  @Column()
  owner: string;

  @ApiProperty()
  @Column({ nullable: true })
  airdrop_fee_token: string;

  @ApiProperty()
  @Column({ nullable: true })
  airdrop_fee_currency: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  airdrop_fee: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  airdrop_fee_usd: number;

  @ApiProperty()
  @Column({ nullable: true })
  royalty_token: string;

  @ApiProperty()
  @Column({ nullable: true })
  royalty_currency: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  royalty: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  royalty_usd: number;

  @ApiProperty()
  @Column({ nullable: true })
  admin_fee_token: string;

  @ApiProperty()
  @Column({ nullable: true })
  admin_fee_currency: string;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  admin_fee: number;

  @ApiProperty()
  @Column({ type: 'float', default: 0 })
  admin_fee_usd: number;

  @ManyToOne((type) => Challenge, (challenge) => challenge.transactions)
  challenge: Challenge;

  @ManyToOne((type) => Nft, (nft) => nft.transactions)
  nft: Nft;

  @ManyToOne((type) => Offer, (offer) => offer.transactions)
  offer: Offer;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
