import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { Comment } from 'src/comments/comment.entity';
import { ApiProperty } from '@nestjs/swagger';
@Entity()
export class CommentLike {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne((type) => Comment, { onDelete: 'CASCADE' })
  comment: Comment;
}
