import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Nft } from 'src/nfts/nft.entity';
import { Challenge } from 'src/nft-challenge/challenges/challenge.entity';
import { CommentLike } from 'src/commentsLike/commentLike.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class Comment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ApiProperty()
  @Column()
  comment: string;

  @ApiProperty()
  @Column({ nullable: true, default: false })
  liked: boolean;

  @ApiProperty({ type: () => User })
  @ManyToOne((type) => User)
  user?: User;

  @ApiProperty({ type: () => Nft })
  @ManyToOne((type) => Nft, (nft) => nft.comments, {
    onDelete: 'CASCADE',
  })
  nft: Nft;

  @ApiProperty({ type: () => Challenge })
  @ManyToOne((type) => Challenge, { onDelete: 'CASCADE' })
  challenge: Challenge;

  @ApiProperty({ type: () => CommentLike })
  @OneToMany((type) => CommentLike, (commentLike) => commentLike.comment)
  commentLike: CommentLike[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
