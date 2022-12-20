import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Royalty {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column({ default: 0 })
  token_id: number;

  @ApiProperty()
  @Column({ default: 0 })
  value: number;
}
