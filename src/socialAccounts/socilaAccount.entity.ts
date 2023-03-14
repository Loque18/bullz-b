import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SocialAccount {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  user_id: string;

  @ApiProperty()
  @Column({ default: '' })
  social_user_id: string;

  @ApiProperty()
  @Column({ default: '' })
  social_user_name: string;

  @ApiProperty()
  @Column({ default: '' })
  access_token: string;

  @ApiProperty()
  @Column({ default: '' })
  token_type: string;

  @ApiProperty()
  @Column({ default: '' })
  social_name: string;

  @ApiProperty()
  @Column({ default: '' })
  refresh_token: string;

  @ApiProperty()
  @Column({ default: 0 })
  expires_in: number;

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
