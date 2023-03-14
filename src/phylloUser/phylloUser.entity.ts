import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PhylloUser {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  user_id: string;

  @ApiProperty()
  @Column()
  phyllo_user_id: string;

  @ApiProperty()
  @Column({ default: '' })
  token: string;

  @ApiProperty()
  @Column({ default: '' })
  platform_id: string;

  @ApiProperty()
  @Column({ default: '' })
  phyllodata: string;

  @ApiProperty()
  @Column({ default: 0 })
  status: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
