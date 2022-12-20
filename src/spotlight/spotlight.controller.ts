import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { SpotlightsService } from './spotlight.service';
import { CreateSpotlightDTO } from './dto/create-spotlight.dto';
import { UpdateSpotlightDTO } from './dto/update-spotlight.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Spotlight } from './spotlight.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
// import { AuthService } from 'src/auth/auth.service';
import { NftsService } from 'src/nfts/nft.service';
import { ChallengesService } from 'src/nft-challenge/challenges/challenge.service';
class DeleteSpotlight {
  @ApiProperty()
  headers: any;

  @ApiProperty()
  data: {
    id: string;
  };
}
@ApiTags('Spotlights')
@Controller('spotlights')
export class SpotlightsController {
  constructor(
    private SpotlightsService: SpotlightsService,
    private nftsService: NftsService,
    private challengeService: ChallengesService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: Spotlight,
    isArray: true,
    description: 'list spotlights',
  })
  async getSpotlights() {
    const spotlight = await this.SpotlightsService.getSpotlights(10, 0);
    return spotlight;
  }

  @ApiBody({
    description: 'Create Spotlight',
    type: CreateSpotlightDTO,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Spotlight,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async addSpotlight(@Body() createSpotlightDTO: CreateSpotlightDTO) {
    try {
      const challenge = await this.challengeService.getSpotLightChallengeById(
        createSpotlightDTO.challenge_id,
      );
      // console.log('challenge', challenge);
      if (challenge) {
        const spotlight = challenge.spotlights;
        // await this.SpotlightsService.getSpotlightByChallengeId(
        //   createSpotlightDTO.challenge_id,
        // );
        // console.log('spolight', spolight);
        if (spotlight.length) {
          throw new HttpException(
            'Challenge id already existed in spotlight',
            HttpStatus.NOT_FOUND,
          );
        } else {
          const insert = await this.SpotlightsService.addSpotlight(challenge);
          return insert;
        }
      } else {
        throw new HttpException(
          'Challenge does not exists with this id.',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (ex) {
      console.log('catch', ex);
      throw new HttpException(ex.message, HttpStatus.NOT_FOUND);
    }
  }

  // @ApiBody({
  //   description: 'Update spotlight',
  //   type: UpdateSpotlightDTO,
  // })
  // @ApiResponse({
  //   description: 'The record has been successfully update.',
  //   type: UpdateResult,
  // })
  // @UseGuards(JwtAuthGuard)
  // @Put()
  // async update(@Body() updateSpotlightDTO: UpdateSpotlightDTO) {
  //   const royaltie = await this.SpotlightsService.update(updateSpotlightDTO);
  //   return royaltie;
  // }

  @ApiBody({
    description: 'Update spotlight orders',
  })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: UpdateResult,
  })
  @UseGuards(JwtAuthGuard)
  @Put('/update-orders')
  async updateOrders(@Body() spotlights) {
    const update = await this.SpotlightsService.updateOrders(spotlights);
    return update;
  }

  @ApiBody({
    description: 'Delete Spotlight',
    type: DeleteSpotlight,
  })
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteSpotlight(
    @Headers('authorization') authorization: string,
    @Body() spotlight: DeleteSpotlight,
  ) {
    console.log('deleteSpotlight', spotlight.data.id);
    // const isAdmin = this.authService.verifyAdmin(authorization);
    // if (isAdmin) {
      const spotlights = await this.SpotlightsService.remove(spotlight.data.id);
      console.log('spotlights', spotlights);
      return spotlights;
    // } else {
    //   throw new HttpException('User is not admin', HttpStatus.UNAUTHORIZED);
    // }
  }
}
