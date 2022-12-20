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
  HttpException,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ChallengesService } from './challenge.service';
import { CreateChallengeDTO } from './dto/create-challenge.dto';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Challenge } from './challenge.entity';
import { UpdateResult, DeleteResult } from 'typeorm';
import { CHALLENGE_STATUS } from './challenge.constant';
import { AuthService } from 'src/auth/auth.service';

class DeleteChallenge {
  @ApiProperty()
  headers: any;

  @ApiProperty()
  data: {
    id: string;
  };
}

@Controller('challenges')
export class ChallengesController {
  constructor(
    private challengesService: ChallengesService,
    private authService: AuthService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: UpdateChallengeDTO,
    isArray: true,
    description: 'list challenges',
  })
  async getAllChallenges() {
    const challenges = await this.challengesService.getAllChallenges();
    return challenges;
  }

  @ApiQuery({ description: 'Challenges' })
  @Get('/admin-challenges/:order')
  async getAdminChallenges(
    @Param('order') order,
    @Query() paginationDto: PaginationDto,
  ) {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.challengesService.getAdminChallenges(paginationDto, order);
  }

  @ApiQuery({ description: 'Challenge' })
  @Get('/challenge-stat')
  async getChallengeStat(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start date or end date missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.challengesService.getChallengeStat(startDate, endDate);
  }

  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @ApiParam({ name: 'order', enum: ['ASC', 'DESC'] })
  @ApiResponse({
    status: 200,
    type: Challenge,
    isArray: true,
    description: 'list challenges',
  })
  @Get('orderBy/:order/filters')
  async getChallenges(
    @Param('order') order,
    @Query() paginationDto: any,
  ): Promise<PaginatedResultDto> {
    const { page, limit, ...filters } = paginationDto;
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.challengesService.getChallenges(
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      filters,
      order,
    );
  }

  @ApiParam({ name: 'seller' })
  @ApiParam({ name: 'order', enum: ['ASC', 'DESC'] })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @ApiResponse({
    status: 200,
    type: Challenge,
    isArray: true,
    description: 'list challenges',
  })
  @Get(':seller/orderBy/:order/filters')
  async getChallenge(
    @Param('seller') seller,
    @Param('order') order,
    @Query() paginationDto: any,
  ): Promise<PaginatedResultDto> {
    const { page, limit, ...filters } = paginationDto;
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.challengesService.getChallenge(
      seller,
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      filters,
      order,
    );
  }

  @ApiParam({ name: 'assetId' })
  @Get('asset/:assetId')
  @ApiResponse({
    status: 200,
    type: Challenge,
    isArray: true,
    description: 'list challenges',
  })
  async getChallengeByAssetId(@Param('assetId') assetId) {
    const challenge = await this.challengesService.getChallengeByAssetId(
      assetId,
    );
    return challenge;
  }

  @ApiParam({ name: 'nftId' })
  @Get('nft/:nftId')
  @ApiResponse({
    status: 200,
    type: Challenge,
    isArray: true,
    description: 'list challenges',
  })
  async getChallengesByNFT(@Param('nftId') nftId) {
    const challenge = await this.challengesService.getChallengesByNFT(nftId);
    return challenge;
  }

  @ApiParam({ name: 'id' })
  @Get('getbyid/:id')
  @ApiResponse({
    status: 200,
    type: Challenge,
    isArray: false,
    description: 'challenge detail',
  })
  async getChallengeById(@Param('id') id) {
    const challenge = await this.challengesService.getChallengeById(id);
    return challenge;
  }

  @Get('/count')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: true,
    description: 'number of challenges',
  })
  async getNumberOfChallenges(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    const challenges = await this.challengesService.getNumberOfChallenges(
      startDate,
      endDate,
    );
    return challenges;
  }

  // @Get('/airdrop-fee')
  // @ApiResponse({
  //   status: 200,
  //   type: Number,
  //   isArray: true,
  //   description: 'total fee collected by airdrop',
  // })
  // async getTotalAirdropFee() {
  //   const airdropFee = await this.challengesService.getTotalAirdropFee();
  //   return airdropFee;
  // }

  @Get('topChallenges/:limit')
  @ApiResponse({
    status: 200,
    type: UpdateChallengeDTO,
    isArray: true,
    description: 'list challenge',
  })
  async getTopChallenges(
    @Param('limit') limit,
    @Query('chainId') chainId,
  ): Promise<any> {
    return this.challengesService.getTopChallenges(
      parseInt(limit),
      parseInt(chainId),
    );
  }

  @ApiBody({
    description: 'CreateChallengeDTO',
    type: CreateChallengeDTO,
  })
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Challenge,
  })
  @Post()
  async addChallenges(@Body() createChallengeDTO: CreateChallengeDTO) {
    const challenges = await this.challengesService.addChallenge(
      createChallengeDTO,
    );
    return challenges;
  }

  @ApiBody({
    description: 'UpdateChallengeDTO',
    type: UpdateChallengeDTO,
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  @Put()
  async update(@Body() updateChallengeDTO: UpdateChallengeDTO) {
    const challenge = await this.challengesService.updateChallenge(
      updateChallengeDTO,
    );
    return challenge;
  }

  @ApiBody({
    description: 'UpdateChallengeDTO',
    type: UpdateChallengeDTO,
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  @Put('/cancelled/:id')
  async updateToCancel(@Param('id') id) {
    const updateChallenge = {
      id: id,
      status: CHALLENGE_STATUS.CANCELLED,
    };
    const challenge = await this.challengesService.updateCancel(
      updateChallenge,
    );
    return challenge;
  }

  @ApiBody({
    description: 'delete challenge',
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  @Delete()
  async deleteChallenge(@Body() challenge: DeleteChallenge) {
    const challenges = await this.challengesService.remove(challenge.data.id);
    return challenges;
  }

  @ApiResponse({
    status: 200,
    type: Challenge,
    isArray: true,
    description: 'Search Api Challenges',
  })
  @ApiParam({ name: 'keyword' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/getSearchChallenge/:keyword')
  async getSearchChallenge(
    @Query() paginationDto: PaginationDto,
    @Param('keyword') keyword,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.challengesService.getSearchChallenge(keyword, {
      ...paginationDto,
      limit: paginationDto.limit,
    });
  }

  @ApiResponse({
    status: 200,
    type: Challenge,
    isArray: true,
    description: 'Search Api Challenges',
  })
  @ApiParam({ name: 'keyword' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/getSearchChallengeByUser/:user/:keyword')
  async getSearchChallengeByUser(
    @Query() paginationDto: PaginationDto,
    @Param('keyword') keyword,
    @Param('user') user,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.challengesService.getSearchChallengeByUser(user, keyword, {
      ...paginationDto,
      limit: paginationDto.limit,
    });
  }

  @Get('spotlight/')
  @ApiResponse({
    status: 200,
    type: UpdateChallengeDTO,
    isArray: true,
    description: 'list challenge',
  })
  async getSpotlightChallenges(
    @Query() paginationDto: PaginationDto,
  ): Promise<any> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.challengesService.getSpotlightChallenges(paginationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('show-hide')
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  async showHide(
    @Headers('authorization') authorization: string,
    @Body() updateNftDTP,
  ) {
    const isAdmin = this.authService.verifyAdmin(authorization);
    if (isAdmin) {
      const nft = await this.challengesService.updateChallenge(updateNftDTP);
      return nft;
    } else {
      throw new HttpException('User is not admin', HttpStatus.UNAUTHORIZED);
    }
  }
}
