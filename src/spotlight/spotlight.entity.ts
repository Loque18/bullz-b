import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Challenge } from 'src/nft-challenge/challenges/challenge.entity';

@Entity()
export class Spotlight {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ default: 0 })
  chain_id: number;

  @ApiProperty()
  @Column({ default: 0 })
  order: number;

  @ManyToOne((type) => Challenge, (challenge) => challenge.spotlights)
  challenge: Challenge;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
