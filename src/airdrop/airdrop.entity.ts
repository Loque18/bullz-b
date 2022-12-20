import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Airdrop {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  email_address: string;

  @ApiProperty()
  @Column()
  eth_address: string;

  @ApiProperty()
  @Column({ default: 0 })
  status: number;
}
