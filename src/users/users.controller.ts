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
} from '@nestjs/common';
import {
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { UpdateBidDTO } from 'src/bids/dto/update-bid.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { DeleteResult, UpdateResult } from 'typeorm';

import { User } from './users.entity';
import { UsersService } from './users.service';

import { CreateUserDTO } from './dto/create-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { NftsService } from 'src/nfts/nft.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private nftService: NftsService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: UpdateUserDTO,
    isArray: true,
    description: 'list users',
  })
  async getUsers() {
    const users = await this.usersService.getUsers();
    return users;
  }

  @ApiQuery({ description: 'Users' })
  @Get('/admin-users/:order')
  async getAdminUsers(
    @Param('order') order,
    @Query() paginationDto: PaginationDto,
  ) {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.usersService.getAdminUsers(paginationDto, order);
  }

  @ApiQuery({ description: 'User' })
  @Get('/user-stat')
  async getUserStat(@Query('startDate') startDate, @Query('endDate') endDate) {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start date or end date missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.usersService.getUserStat(startDate, endDate);
  }

  @Get('/count')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: false,
    description: 'number of users',
  })
  async getNumberOfUsers(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
    @Query('selectedSocials') selectedSocials,
  ) {
    const countUser = await this.usersService.getNumberOfUsers(
      startDate,
      endDate,
      selectedSocials,
    );
    return countUser;
  }

  @Get('/topCreators/:startDate/:endDate')
  @ApiResponse({
    status: 200,
    type: UpdateUserDTO,
    isArray: true,
    description: 'list users',
  })
  async getTopCreators(
    @Param('startDate') startDate,
    @Param('endDate') endDate,
  ) {
    const users = await this.usersService.getTopCreators(startDate, endDate);
    return users;
  }

  @ApiResponse({
    status: 200,
    type: User,
    isArray: true,
    description: 'All top Creators',
  })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/allCreators')
  async getAllCreators(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.usersService.getAllCreators({
      ...paginationDto,
      limit: paginationDto.limit,
    });
  }

  @Get('/topBuyers')
  @ApiResponse({
    status: 200,
    type: UpdateUserDTO,
    isArray: true,
    description: 'list users',
  })
  async getTopBuyers() {
    const users = await this.usersService.getTopBuyers();
    return users;
  }

  @ApiResponse({
    status: 200,
    type: User,
    isArray: true,
    description: 'All top Buyers',
  })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/allBuyers')
  async getAllBuyers(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.usersService.getAllBuyers({
      ...paginationDto,
      limit: paginationDto.limit,
    });
  }

  @ApiParam({ name: 'address' })
  @Get(':address')
  @ApiResponse({
    status: 200,
    type: UpdateUserDTO,
    isArray: true,
    description: 'list users',
  })
  async getUser(@Param('address') address) {
    const user = await this.usersService.getUser(address);
    return user;
  }

  @ApiParam({ name: 'id' })
  @Get('/getById/:id')
  @ApiResponse({
    status: 200,
    type: UpdateUserDTO,
    isArray: false,
    description: 'list users',
  })
  async getUserById(@Param('id') id) {
    const user = await this.usersService.find(id);
    return user;
  }

  @ApiParam({ name: 'id' })
  @Get('/getOwnedNFTCountById/:id')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: false,
    description: 'User Owned NFT count',
  })
  async getOwnedNFTCountByUserId(@Param('id') id) {
    const user = await this.usersService.find(id);
    return user.ownedNFTCount;
  }

  @ApiParam({ name: 'userId' })
  @Get('getFollowers/:userId')
  @ApiResponse({
    status: 200,
    type: UpdateUserDTO,
    isArray: true,
    description: 'list users',
  })
  async getFollowers(@Param('userId') userId) {
    const user = await this.usersService.getFollower(userId);
    return user;
  }

  @ApiParam({ name: 'userId' })
  @Get('getFollowing/:userId')
  @ApiResponse({
    status: 200,
    type: UpdateUserDTO,
    isArray: true,
    description: 'list users',
  })
  async getFollowing(@Param('userId') userId) {
    const user = await this.usersService.getFollowing(userId);
    return user;
  }

  @ApiParam({ name: 'user' })
  @ApiParam({ name: 'user2' })
  @Get('follow/:user/:user2')
  @ApiResponse({
    status: 200,
    type: String,
    description: 'Followed/Unfollowed Successfully',
  })
  async follow(@Param('user') userId, @Param('user2') userId2) {
    const user = await this.usersService.follow(userId, userId2);
    return user;
  }

  @ApiParam({ name: 'user' })
  @ApiParam({ name: 'user2' })
  @Get('checkFollow/:user/:user2')
  @ApiResponse({ status: 200, type: Boolean, description: 'if followed' })
  async checkFollow(@Param('user') userId, @Param('user2') userId2) {
    const user = await this.usersService.checkFollow(userId, userId2);
    return user;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UpdateUserDTO,
  })
  async addUser(@Body() createUserDTO: CreateUserDTO) {
    const user = await this.usersService.addUser(createUserDTO);
    return user;
  }
  // @Put()
  // async update(@Body() updateBidDTO: UpdateBidDTO) {
  //     const user = await this.usersService.updateUser(updateBidDTO);
  //     return user;
  // }
  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  async update(@Body() updateUserDTO: UpdateUserDTO) {
    delete updateUserDTO['likes'];
    delete updateUserDTO['challengeCreated'];
    delete updateUserDTO['challengeSubmitted'];
    const user = await this.usersService.updateUser(updateUserDTO);
    return user;
  }

  @ApiQuery({ name: 'id' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  async deleteUser(@Query() id) {
    const users = await this.usersService.remove(id);
    return users;
  }

  @ApiResponse({
    status: 200,
    type: User,
    isArray: true,
    description: 'Search Api User',
  })
  @ApiParam({ name: 'keyword' })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/getSearchUser/:keyword')
  async getSearchUser(
    @Query() paginationDto: PaginationDto,
    @Param('keyword') keyword,
  ): Promise<PaginatedResultDto> {
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);
    return this.usersService.getSearchUser(keyword, {
      ...paginationDto,
      limit: paginationDto.limit,
    });
  }

  @ApiResponse({
    status: 200,
    type: User,
    isArray: false,
    description: 'Search Api User',
  })
  @ApiParam({ name: 'username' })
  @ApiQuery({ description: 'User', type: UpdateUserDTO })
  @Get('/getbyusername/:username')
  async getUserByName(@Param('username') username) {
    return this.usersService.getUserByName(username);
  }
}
