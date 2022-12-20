import { Injectable } from '@nestjs/common';
import { CommentLike } from './commentLike.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentLikeDTO } from './dto/createCommentLikeDTO';
@Injectable()
export class CommentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private commentsLikeRepository: Repository<CommentLike>,
  ) {}

  async commentLikeDislike(commentLike: CreateCommentLikeDTO): Promise<any> {
    var result = await this.commentsLikeRepository
      .createQueryBuilder('CommentLike')
      .leftJoinAndSelect('CommentLike.comment', 'comment')
      .leftJoinAndSelect('CommentLike.user', 'user')
      .where('user.id = :user', { user: commentLike.user })
      .andWhere('comment.id = :comment', { comment: commentLike.comment })
      .getOne();
    if (result) {
      return this.commentsLikeRepository.delete(commentLike);
    } else {
      return this.commentsLikeRepository.save(commentLike);
    }
  }

  //   async alreadyLiked(commentId,userId): Promise<any> {
  //     var result = await this.commentsLikeRepository.createQueryBuilder("CommentLike")
  //     .leftJoinAndSelect("CommentLike.comment", "comment")
  //     .leftJoinAndSelect("CommentLike.user","user")
  //     .where('user.id = :user',{user:userId})
  //     .andWhere('comment.id = :comment',{comment:commentId})
  //     .getOne();
  //     if (result){
  //       return true
  //     }
  //     else{
  //     return false
  //     }
  // }

  //   async getCommentLikeById(id):Promise<any>{
  //     return  this.commentsLikeRepository.createQueryBuilder("CommentLike")
  //     .leftJoinAndSelect("CommentLike.comment", "comment")
  //     .where('comment.id = :id',{id:id})
  //     .getMany();
  //   }
}
