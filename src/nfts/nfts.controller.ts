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
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { UpdateResult, DeleteResult } from 'typeorm';

import { Nft } from './nft.entity';
import { NftsService } from './nft.service';

import { CreateNftDTO } from './dto/create-nft.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';
import { UpdateNftDTO } from './dto/update-nft.dto';
import { AuthService } from 'src/auth/auth.service';
@Controller('nfts')
export class NftsController {
  constructor(
    private nftsService: NftsService,
    private authService: AuthService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNfts() {
    const royalties = await this.nftsService.getNfts();
    return royalties;
  }

  @ApiQuery({ description: 'Nfts' })
  @Get('/admin-nfts/:order')
  async getAdminNfts(
    @Param('order') order,
    @Query() paginationDto: PaginationDto,
  ) {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.nftsService.getAdminNfts(paginationDto, order);
  }

  @Get('/trendingNfts')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getTrendingNfts(@Query('chainId') chainId) {
    const royalties = await this.nftsService.getTrendingNfts(parseInt(chainId));
    return royalties;
  }

  @Get('/liveAuctions')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getLiveAuctions() {
    const royalties = await this.nftsService.getLiveAuctions();
    return royalties;
  }

  @ApiParam({ name: 'id' })
  @Get('/:id')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNft(@Param('id') id) {
    const nfts = await this.nftsService.getNft(id);
    return nfts;
  }

  @ApiParam({ name: 'id' })
  @Get('asset/:id')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftAssetId(@Param('id') id) {
    const nfts = await this.nftsService.getNftAssetId(id);
    return nfts;
  }

  @ApiParam({ name: 'asset_id' })
  @Get('challengeType/:asset_id')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: false,
    description: 'challenge type nft',
  })
  async getChallengeNftAssetId(@Param('asset_id') asset_id) {
    const nfts = await this.nftsService.getChallengeNftAssetId(asset_id);
    return nfts;
  }

  @ApiParam({ name: 'owner_address' })
  @Get('owner/:owner_address')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftsbyOwner(@Param('owner_address') owner_address) {
    const royaltie = await this.nftsService.getNftsbyOwner(owner_address);
    return royaltie;
  }

  @ApiParam({ name: 'sortBy' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('owner/:sortBy/filters/')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftsByOwnerSale(
    @Query() paginationDto: any,
    @Param('sortBy') sortBy,
  ): Promise<PaginatedResultDto> {
    const { page, limit, ...filters } = paginationDto;
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.nftsService.getNftsByOwnerSale(
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      sortBy,
      filters,
    );
  }

  // @ApiParam({ name: 'sortBy' })
  // @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  // @Get('admin/:sortBy/filters/')
  // @ApiResponse({
  //   status: 200,
  //   type: UpdateNftDTO,
  //   isArray: true,
  //   description: 'list nfts',
  // })
  // async getAdminNfts(
  //   @Query() paginationDto: any,
  //   @Param('sortBy') sortBy,
  // ): Promise<PaginatedResultDto> {
  //   const { page, limit, ...filters } = paginationDto;
  //   paginationDto.page = Number(paginationDto.page);
  //   paginationDto.limit = Number(paginationDto.limit);
  //   return this.nftsService.getNftsByOwnerSale(
  //     {
  //       ...paginationDto,
  //       limit: paginationDto.limit,
  //     },
  //     sortBy,
  //     filters,
  //     true,
  //   );
  // }

  @Get('byArtwork/all')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftsByArtwork(): Promise<any> {
    return this.nftsService.getNftsByArtwork();
  }

  @Get('topChallenges/:limit')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getTopChallenges(
    @Param('limit') limit,
    @Query('chainId') chainId,
  ): Promise<any> {
    return this.nftsService.getTopChallenges(
      parseInt(limit),
      parseInt(chainId),
    );
  }

  @ApiParam({ name: 'holder' })
  @Get('count/:holder')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getCount(@Param('holder') holder): Promise<any> {
    return this.nftsService.getCount(holder);
  }

  @Get('all/length')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'count nfts',
  })
  async getAllCount(): Promise<number> {
    return this.nftsService.getAllCount();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UpdateNftDTO,
  })
  async addNft(@Body() createNftDTO: CreateNftDTO) {
    const royaltie = await this.nftsService.addNft(createNftDTO);
    return royaltie;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  async update(@Body() updateNftDTO: UpdateNftDTO) {
    const nft = await this.nftsService.update(updateNftDTO);
    return nft;
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
      const nft = await this.nftsService.update(updateNftDTP);
      return nft;
    } else {
      throw new HttpException('User is not admin', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiParam({ name: 'nftId' })
  @ApiParam({ name: 'address' })
  @Get('likeNft/:nftId/:address')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async likeNft(@Param('nftId') nftId, @Param('address') address) {
    const royaltie = await this.nftsService.likeNft(nftId, address);
    return royaltie;
  }

  @ApiParam({ name: 'assetId' })
  @Get('item/:assetId')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  getMetadata(@Param('assetId') assetId) {
    return this.nftsService.getMetadata(assetId);
  }

  @Get('holder/:holderId/assetId/:assetId')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: false,
    description: 'user nft',
  })
  getByHolderAndAsssetId(
    @Param('holderId') holderId,
    @Param('assetId') assetId,
  ) {
    return this.nftsService.getByHolderAndAsssetId(holderId, assetId);
  }

  @ApiParam({ name: 'nftId' })
  @Get('increaseView/:nftId')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async increaseView(@Param('nftId') nftId) {
    const royaltie = await this.nftsService.increaseView(nftId);
    return royaltie;
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  async deleteNft(@Query() id) {
    const nfts = await this.nftsService.remove(id);
    return nfts;
  }

  @ApiResponse({
    status: 200,
    type: Nft,
    isArray: true,
    description: 'Search Api NFTs',
  })
  @ApiParam({ name: 'keyword' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/getSearchNft/:keyword')
  async getSearchUser(
    @Query() paginationDto: PaginationDto,
    @Param('keyword') keyword,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.nftsService.getSearchNft(keyword, {
      ...paginationDto,
      limit: paginationDto.limit,
    });
  }

  @ApiResponse({
    status: 200,
    type: Nft,
    isArray: true,
    description: 'Search Api NFTs by Collection',
  })
  @ApiParam({ name: 'keyword' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/getSearchNftByCollection/:keyword/:collection')
  async getSearchNftByCollection(
    @Query() paginationDto: PaginationDto,
    @Param('keyword') keyword,
    @Param('collection') collection,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.nftsService.getSearchNftByCollection(collection, keyword, {
      ...paginationDto,
      limit: paginationDto.limit,
    });
  }

  @ApiResponse({
    status: 200,
    type: Nft,
    isArray: true,
    description: 'Search Api with Type',
  })
  @ApiParam({ name: 'keyword' })
  @Get('/getSearchByType/:type/:keyword')
  async getSearch(@Param('type') type, @Param('keyword') keyword) {
    const searchResult = await this.nftsService.getSearchByType(type, keyword);
    return searchResult;
  }

  @ApiParam({ name: 'sortBy' })
  @ApiParam({ name: 'param' })
  @ApiParam({ name: 'ownerAddress' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('ownerByFilter/:sortBy/:param/:ownerAddress/filters/')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftsByFilterLiked(
    @Query() paginationDto: any,
    @Param('sortBy') sortBy,
    @Param('param') param,
    @Param('ownerAddress') ownerAddress,
  ): Promise<PaginatedResultDto> {
    const { page, limit, ...filters } = paginationDto;
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.nftsService.getNftsByFiltersLiked(
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      sortBy,
      param,
      ownerAddress,
      filters,
    );
  }

  @ApiParam({ name: 'sortBy' })
  @ApiParam({ name: 'param' })
  @ApiParam({ name: 'ownerAddress' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('getNftsForChallenge/:ownerAddress')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftsForChallenge(
    @Query() paginationDto: any,
    @Param('ownerAddress') ownerAddress,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    paginationDto.chainId = Number(paginationDto.chainId);

    return this.nftsService.getNftsForChallenge(
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      ownerAddress,
    );
  }
}

//API not used

/*
  @ApiParam({ name: 'nftType' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/paginated/:nftType')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftsPaginate(
    @Param('nftType') nftType,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.nftsService.getNftsPaginate(nftType, {
      ...paginationDto,
      limit: paginationDto.limit,
    });
  }






  
  @ApiParam({ name: 'id' })
  @ApiParam({ name: 'filter' })
  @ApiParam({ name: 'value' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('collection/:id/paginated/:filter/:value')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftCollectionId(
    @Param('id') id,
    @Param('filter') filter,
    @Param('value') value,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.nftsService.getNftCollectionId(
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      id,
      filter,
      value,
    );
  }


    @ApiParam({ name: 'filter' })
  @ApiParam({ name: 'value' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('explore/:filter/:value')
  async getExploreItems(
    @Param('filter') filter,
    @Param('value') value,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.nftsService.getExploreItem(
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      filter,
      value,
    );
  }



    @ApiParam({ name: 'owner_address' })
  @ApiParam({ name: 'type' })
  @ApiParam({ name: 'filter' })
  @ApiParam({ name: 'value' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('owner/:owner_address/paginated/:type/:filter/:value')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftsByOwnerPaginate(
    @Param('owner_address') owner_address,
    @Param('type') type,
    @Param('filter') filter,
    @Param('value') value,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.nftsService.getNftsByOwnerPaginate(
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      owner_address,
      type,
      filter,
      value,
    );
  }

@ApiParam({ name: 'ownerAddress' })
  @ApiParam({ name: 'sortBy' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('owner/:ownerAddress/:sortBy/filters/')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts',
  })
  async getNftsByOwnerLiked(
    @Query() paginationDto: any,
    @Param('sortBy') sortBy,
    @Param('ownerAddress') ownerAddress,
  ): Promise<PaginatedResultDto> {
    const { page, limit, ...filters } = paginationDto;
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.nftsService.getNftsByOwnerLiked(
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      sortBy,
      ownerAddress,
      filters,
    );
  }

@ApiParam({ name: 'collectionAddress' })
  @ApiParam({ name: 'sortBy' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('collection/:collectionAddress/:sortBy/filters/')
  @ApiResponse({
    status: 200,
    type: UpdateNftDTO,
    isArray: true,
    description: 'list nfts by collection',
  })
  async getNftsByCollection(
    @Query() paginationDto: any,
    @Param('collectionAddress') collectionAddress,
    @Param('sortBy') sortBy,
  ): Promise<PaginatedResultDto> {
    const { page, limit, ...filters } = paginationDto;
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.nftsService.getNftsByCollection(
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      collectionAddress,
      sortBy,
      filters,
    );
  }
  */
