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
import { OffersService } from './offer.service';
import { CreateOfferDTO } from './dto/create-offer.dto';
import { UpdateOfferDTO } from './dto/update-offer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiProperty,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { UpdateResult, DeleteResult } from 'typeorm';

class DeleteOffer {
  @ApiProperty()
  headers: any;

  @ApiProperty()
  data: {
    id: string;
  };
}

@Controller('Offers')
export class OffersController {
  constructor(private OffersService: OffersService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: UpdateOfferDTO,
    isArray: true,
    description: 'list offers',
  })
  async getOffers() {
    const offers = await this.OffersService.getOffers();
    return offers;
  }

  @ApiParam({ name: 'seller' })
  @Get(':seller')
  @ApiResponse({
    status: 200,
    type: UpdateOfferDTO,
    isArray: true,
    description: 'list offers',
  })
  async getOffer(@Param('seller') seller) {
    const offer = await this.OffersService.getOffer(seller);
    return offer;
  }

  @ApiParam({ name: 'nft_id' })
  @Get('getbynft/:nft_id')
  @ApiResponse({
    status: 200,
    type: UpdateOfferDTO,
    isArray: true,
    description: 'list offers',
  })
  async getOffersByNFT(@Param('nft_id') nft_id) {
    const offer = await this.OffersService.getOffersByNFT(nft_id);
    return offer;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UpdateOfferDTO,
  })
  async addOffer(@Body() createOfferDTO: CreateOfferDTO) {
    const offer = await this.OffersService.addOffer(createOfferDTO);
    return offer;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  async update(@Body() updateOfferDTO: UpdateOfferDTO) {
    const offer = await this.OffersService.updateOffer(updateOfferDTO);
    return offer;
  }

  @ApiBody({
    description: 'Delete offer',
    type: DeleteOffer,
  })
  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  async deleteOffer(@Body() nft) {
    console.log(nft);
    const offers = await this.OffersService.remove(nft.data.id);
    return offers;
  }
}
