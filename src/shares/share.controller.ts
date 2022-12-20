import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ShareService } from './share.service';
import { CreateShareDTO } from './dto/create-share.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Share } from './share.entity';
import { DeleteResult } from 'typeorm';

@Controller('shares')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: Share,
    isArray: true,
    description: 'list shares',
  })
  async getShares() {
    const royalties = await this.shareService.getShares();
    return royalties;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Share,
  })
  async addRoyalty(@Body() createShareDTO: CreateShareDTO) {
    const royaltie = await this.shareService.addShare(createShareDTO);
    return royaltie;
  }

  @Get('/stat')
  async getShareStat(@Query('startDate') startDate, @Query('endDate') endDate) {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start date or end date missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.shareService.getShareStat(startDate, endDate);
  }

  @Get('/count')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: true,
    description: 'number of comments',
  })
  async getNumberOfShare(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    return this.shareService.getNumberOfShare(startDate, endDate);
  }
}
