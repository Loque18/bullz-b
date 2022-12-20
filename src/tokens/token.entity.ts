import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Challenge } from 'src/nft-challenge/challenges/challenge.entity';

@Entity()
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  address: string;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  chain_id: string;

  @Column({ default: 18 })
  decimal: number;

  @Column()
  user: string;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @OneToMany((type) => Challenge, (challenge) => challenge.token)
  challenges: Challenge[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
