import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class LastBlock {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  event_name: string;

  @ApiProperty()
  @Column()
  last_fetch_block: number;

  @ApiProperty()
  @Column({ default: 0 })
  chain_id: number;

  @ApiProperty()
  @Column({ default: false })
  is_deleted: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: string;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: string;
}
