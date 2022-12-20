import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CommentLikeService } from './commentLike.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCommentLikeDTO } from './dto/createCommentLikeDTO';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CommentLike } from './commentLike.entity';

@Controller('commentsLike')
export class CommentLikeController {
  constructor(private commentLikeService: CommentLikeService) {}

  // @Get("/getByCommentId/:id")
  // async getCommentLikeByComment(@Param('id') id) {
  //     const comments = await this.commentLikeService.getCommentLikeById(id);
  //     return comments;
  // }

  // @Get("/alreadyLiked/:commentId/:userId")
  // async alreadyLiked(@Param('commentId') commentId, @Param('userId') userId) {
  //     const comments = await this.commentLikeService.alreadyLiked(commentId,userId);
  //     return comments;
  // }
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CommentLike,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/commentLikeDislike')
  async commentLikeDislike(@Body() createCommentDTO: CreateCommentLikeDTO) {
    const comment = await this.commentLikeService.commentLikeDislike(
      createCommentDTO,
    );
    return comment;
  }
}
