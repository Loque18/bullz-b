import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/users.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Like {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  assetId: string;

  @ManyToOne((type) => User, (user) => user.likes)
  user: User;
}
