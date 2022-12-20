import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiParam, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { AddCommentDTO } from './dto/addCommentDTO';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @ApiParam({ name: 'nftId' })
  @ApiParam({ name: 'userId' })
  @Get('/getByNFTId/:nftId/:userId')
  @ApiResponse({
    status: 200,
    type: Comment,
    isArray: true,
    description: 'list comments',
  })
  async getCommentByNFT(@Param('nftId') nftId, @Param('userId') userId) {
    const comments = await this.commentService.getCommentByNFT(nftId, userId);
    return comments;
  }

  @ApiParam({ name: 'challengeId' })
  @ApiParam({ name: 'userId' })
  @Get('/getByChallengeId/:challengeId/:userId')
  @ApiResponse({
    status: 200,
    type: Comment,
    isArray: true,
    description: 'list comments',
  })
  async getCommentByChallengeId(
    @Param('challengeId') challengeId,
    @Param('userId') userId,
  ) {
    const comments = await this.commentService.getCommentByChallenge(
      challengeId,
      userId,
    );
    return comments;
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Comment,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/addComment')
  async addComment(@Body() createCommentDTO: AddCommentDTO) {
    const comment = await this.commentService.addComment(createCommentDTO);
    return comment;
  }

  @Get('/comment-stat')
  async getCommentStat(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start date or end date missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.commentService.getCommentStat(startDate, endDate);
  }

  @Get('/count')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: true,
    description: 'number of comments',
  })
  async getNumberOfComment(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    const challenges = await this.commentService.getNumberOfComment(
      startDate,
      endDate,
    );
    return challenges;
  }
}
