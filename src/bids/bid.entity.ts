import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn } from 'typeorm';
import { Offer } from 'src/offers/offer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Bid {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  bidder: string;

  @ApiProperty()
  @Column()
  token: string;

  @ApiProperty()
  @Column()
  price: string;

  @ApiProperty()
  @Column({ default: false })
  isWinner: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  supply: number;

  @ApiProperty()
  @Column({ nullable: true })
  fileUrl: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne((type) => Offer, (offer) => offer.bids, { onDelete: 'CASCADE' })
  offer: Offer;
}
