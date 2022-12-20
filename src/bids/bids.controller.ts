import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BidsService } from './bid.service';
import { CreateBidDTO } from './dto/create-bid.dto';
import { UpdateBidDTO } from './dto/update-bid.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Bid } from './bid.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

class DeleteBid {
  @ApiProperty()
  headers: any;

  @ApiProperty()
  data: {
    id: string;
  };
}
@ApiTags('Bids')
@Controller('Bids')
export class BidsController {
  constructor(private BidsService: BidsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: Bid,
    isArray: true,
    description: 'list bids',
  })
  async getBids() {
    const bids = await this.BidsService.getBids();
    return bids;
  }

  @ApiBody({
    description: 'Create bid',
    type: CreateBidDTO,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Bid,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async addBid(@Body() createBidDTO: CreateBidDTO) {
    const royaltie = await this.BidsService.addBid(createBidDTO);
    return royaltie;
  }

  @ApiBody({
    description: 'Update bid',
    type: UpdateBidDTO,
  })
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() updateBidDTO: UpdateBidDTO) {
    const royaltie = await this.BidsService.update(updateBidDTO);
    return royaltie;
  }

  @ApiBody({
    description: 'Delete bid',
    type: DeleteBid,
  })
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteBid(@Body() bid: DeleteBid) {
    const royalties = await this.BidsService.remove(bid.data.id);
    return royalties;
  }
}


//APIs not used
/*
@ApiParam({ name: 'bidder' })
  @ApiResponse({
    status: 200,
    type: Bid,
    isArray: true,
    description: 'list bids',
  })
  @Get(':bidder')
  async getBid(@Param('bidder') bidder) {
    const royaltie = await this.BidsService.getBid(bidder);
    return royaltie;
  }
  */