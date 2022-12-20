import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class TempStorage {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ default: '' })
  eventId: string;

  @ApiProperty()
  @Column()
  event_name: string;

  @ApiProperty()
  @Column()
  user_id: string;

  @ApiProperty()
  @Column()
  json_string: string;

  @ApiProperty()
  @Column({ default: 0 })
  status: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
