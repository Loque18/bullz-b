import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class NftScanner {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  user: string;

  @ApiProperty({ default: 0 })
  @Column()
  chain_id: number;

  @ApiProperty({ default: 0 })
  @Column()
  status: number;

  //1=NFT, 2=TOKEN
  @ApiProperty({ default: 1 })
  @Column()
  asset_type: number;

  @ApiProperty()
  @UpdateDateColumn()
  last_updated: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
