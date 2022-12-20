import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Nft } from 'src/nfts/nft.entity';
import { User } from 'src/users/users.entity';

@Entity()
export class Report {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  report_for: string;

  @ApiProperty()
  @Column()
  reporter_id: string;

  @ApiProperty()
  @Column()
  reported_id: string;

  @ApiProperty()
  @Column('text', { array: true })
  report_list: string[];

  @ApiProperty()
  @Column({ default: 0 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
