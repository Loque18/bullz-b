import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDTO } from './dto/create-like.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { Like } from 'typeorm';

@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @ApiResponse({
    status: 200,
    type: Like,
    isArray: true,
    description: 'list likes',
  })
  @Get('/getLikes')
  async getLikes() {
    const likes = await this.likeService.getLikes();
    return likes;
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Like,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/addLike')
  async addLike(@Body() createLikeDTO: CreateLikeDTO) {
    const like = await this.likeService.addLike(createLikeDTO);
    return like;
  }
}
