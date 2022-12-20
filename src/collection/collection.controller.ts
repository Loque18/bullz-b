import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CreateCollectionDTO } from './dto/create-collection.dto';
import { UpdateCollectionDTO } from './dto/update-collection.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiProperty,
  ApiBody,
} from '@nestjs/swagger';
import { Collection } from './collection.entity';
import { AuthService } from 'src/auth/auth.service';
// import { UseInterceptors, UploadedFile } from  '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from  'multer';
// import { extname } from  'path';
import { UpdateResult, DeleteResult } from 'typeorm';
class DeleteCollection {
  @ApiProperty()
  headers: any;

  @ApiProperty()
  data: {
    id: string;
  };
}
@Controller('collection')
export class CollectionController {
  constructor(
    private collectionService: CollectionService,
    private authService: AuthService,
  ) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateCollectionDTO,
  })
  @ApiBody({
    description: 'createCollectionDTO',
    type: CreateCollectionDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async addAdminCollection(
    @Headers('authorization') authorization: string,
    @Body() createCollectionDTO: CreateCollectionDTO,
  ) {
    const isAdmin = this.authService.verifyAdmin(authorization);
    if (isAdmin) {
      const airdrop = await this.collectionService.addCollection(
        createCollectionDTO,
      );
      return airdrop;
    } else {
      throw new HttpException('User is not admin', HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/admin')
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  async update(
    @Headers('authorization') authorization: string,
    @Body() updateCollectionDTO: UpdateCollectionDTO,
  ) {
    const isAdmin = this.authService.verifyAdmin(authorization);
    if (isAdmin) {
      const collection = await this.collectionService.update(
        updateCollectionDTO,
      );
      return collection;
    } else {
      throw new HttpException('User is not admin', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiResponse({
    status: 200,
    type: Collection,
    isArray: true,
    description: 'list collections',
  })
  @Get('/admin/:order')
  async getAdminCollections(
    @Param('order') order,
    @Query() paginationDto: PaginationDto,
  ) {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    const collections = await this.collectionService.getAdminCollections(
      paginationDto,
      order,
    );
    return collections;
  }

  @ApiResponse({
    status: 200,
    type: Collection,
    isArray: true,
    description: 'list collections',
  })
  @Get('/byid/:id')
  async getCollectionById(@Param('id') id) {
    const collections = await this.collectionService.getCollectionsById(id);
    return collections;
  }

  @ApiResponse({
    status: 200,
    type: Collection,
    isArray: true,
    description: 'list collections',
  })
  @Get('/getTrending/:startDate/:endDate')
  async getTrending(
    @Param('startDate') startDate,
    @Param('endDate') endDate,
    @Query('chainId') chainId,
  ) {
    const collections = await this.collectionService.getTrending(
      startDate,
      endDate,
      parseInt(chainId),
    );
    return collections;
  }

  @ApiResponse({
    status: 200,
    type: Collection,
    isArray: true,
    description: 'list collections',
  })
  @ApiParam({ name: 'collectionAddress' })
  @Get('/getCollectionsByAddress/:collectionAddress')
  async getCollectionsByAddress(@Param('collectionAddress') collectionAddress) {
    const collections = await this.collectionService.getCollectionsByAddress(
      collectionAddress,
    );
    return collections;
  }

  @ApiResponse({
    status: 200,
    type: Collection,
    isArray: true,
    description: 'list collections',
  })
  @ApiQuery({ description: 'PaginationDto', type: PaginationDto })
  @Get('/getCollectionPaginated')
  async getNftsPaginate(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.collectionService.getCollectionsPaginated({
      ...paginationDto,
      limit: paginationDto.limit,
    });
    // limit: paginationDto.limit > 10 ? 10 : paginationDto.limit
  }

  @ApiResponse({
    status: 200,
    type: Collection,
    isArray: true,
    description: 'list collections',
  })
  @ApiQuery({ description: 'PaginationDto', type: PaginationDto })
  @ApiParam({ name: 'collectionType' })
  @Get('/getCollectionByTypePaginated/:collectionType/:id/:chain_id')
  async getCollectionsByTypePaginated(
    @Query() paginationDto: PaginationDto,
    @Param('collectionType') collectionType,
    @Param('id') id,
    @Param('chain_id') chain_id,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.collectionService.getCollectionsByTypePaginated(
      collectionType,
      id,
      chain_id,
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
    );
    // limit: paginationDto.limit > 10 ? 10 : paginationDto.limit
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Collection,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ description: 'CreateCollectionDTO', type: CreateCollectionDTO })
  @Post('/addCollection')
  async addCollection(@Body() createCollectionDTO: CreateCollectionDTO) {
    console.log(createCollectionDTO);
    const collection = await this.collectionService.addCollection(
      createCollectionDTO,
    );
    return collection;
  }

  @ApiResponse({
    status: 200,
    type: Collection,
    isArray: true,
    description: 'Search Api',
  })
  @ApiParam({ name: 'keyword' })
  @Get('/getSearch/:keyword')
  async getSearch(@Param('keyword') keyword) {
    const searchResult = await this.collectionService.getSearch(keyword);
    return searchResult;
  }

  @ApiResponse({
    status: 200,
    type: Collection,
    isArray: true,
    description: 'Search Api Collection',
  })
  @ApiParam({ name: 'keyword' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/getSearchCollection/:keyword')
  async getSearchCollection(
    @Query() paginationDto: PaginationDto,
    @Param('keyword') keyword,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.collectionService.getSearchCollection(keyword, {
      ...paginationDto,
      limit: paginationDto.limit,
    });
  }

  @ApiBody({
    description: 'Delete Collection',
    type: DeleteCollection,
  })
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteCollection(
    @Headers('authorization') authorization: string,
    @Body() collection: DeleteCollection,
  ) {
    console.log('deleteColection', collection.data.id);
    const isAdmin = this.authService.verifyAdmin(authorization);
    if (isAdmin) {
      const removed = await this.collectionService.remove(collection.data.id);
      console.log('spotlights', removed);
      return removed;
    } else {
      throw new HttpException('User is not admin', HttpStatus.UNAUTHORIZED);
    }
  }
}

//API not used
/*
  @ApiResponse({
    status: 200,
    type: Collection,
    isArray: true,
    description: 'list collections',
  })
  @ApiParam({ name: 'collectionType' })
  @Get('/getCollections/:collectionType')
  async getCollections(@Param('collectionType') collectionType) {
    const collections = await this.collectionService.getCollections(
      collectionType,
    );
    return collections;
  }
*/