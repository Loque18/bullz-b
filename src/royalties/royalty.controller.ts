import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoyaltysService } from './royalty.service';
import { CreateRoyaltyDTO } from './dto/create-royalty.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Royalty } from './royalty.entity';
import { DeleteResult } from 'typeorm';

@Controller('royalties')
export class RoyaltysController {
  constructor(private royaltiesService: RoyaltysService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: Royalty,
    isArray: true,
    description: 'list royalties',
  })
  async getRoyaltys() {
    const royalties = await this.royaltiesService.getRoyaltys();
    return royalties;
  }

  @ApiParam({ name: 'token_id' })
  @Get(':token_id')
  @ApiResponse({
    status: 200,
    type: Royalty,
    isArray: true,
    description: 'list royalties',
  })
  async getRoyalty(@Param('token_id') token_id) {
    const royaltie = await this.royaltiesService.getRoyalty(token_id);
    return royaltie;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Royalty,
  })
  async addRoyalty(@Body() createRoyaltyDTO: CreateRoyaltyDTO) {
    const royaltie = await this.royaltiesService.addRoyalty(createRoyaltyDTO);
    return royaltie;
  }

  @ApiQuery({ name: 'id' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  async deleteRoyalty(@Query() id) {
    const royalties = await this.royaltiesService.remove(id);
    return royalties;
  }
}
