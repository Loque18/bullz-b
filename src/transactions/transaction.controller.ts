import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { UpdateTransactionDTO } from './dto/update-transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from './transaction.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: Transaction,
    isArray: true,
    description: 'list transactions',
  })
  async getTranssactions() {
    const transactions = await this.transactionsService.getTranssactions();
    return transactions;
  }

  @ApiBody({
    description: 'Create transaction',
    type: CreateTransactionDTO,
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateTransactionDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTransactionDTO: CreateTransactionDTO) {
    const royaltie = await this.transactionsService.create(
      createTransactionDTO,
    );
    return royaltie;
  }

  @ApiBody({
    description: 'Update Transaction',
    type: UpdateTransactionDTO,
  })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: UpdateResult,
  })
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(@Body() updateTransactionDTO: UpdateTransactionDTO) {
    const tx = await this.transactionsService.update(updateTransactionDTO);
    return tx;
  }

  @Get('/airdrop-fee')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: false,
    description: 'airdrop fee',
  })
  async getTotalAirdropFee(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    const sum = await this.transactionsService.getTotalAirdropFee(
      startDate,
      endDate,
    );
    return sum;
  }

  @Get('/airdrop-stat')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: false,
    description: 'airdrop stat',
  })
  async getAirdropStat(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start date or end date missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = await this.transactionsService.getAirdropStat(
      startDate,
      endDate,
    );
    return data;
  }

  @Get('/royalty-fee')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: false,
    description: 'royalty fee',
  })
  async getTotalRoyalties(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    const sum = await this.transactionsService.getTotalRoyalties(
      startDate,
      endDate,
    );
    return sum;
  }

  @Get('/royalty-stat')
  @ApiResponse({
    status: 200,
    type: Number,
    isArray: false,
    description: 'royalty stat',
  })
  async getRoyaltiesStat(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    if (!startDate || !endDate) {
      throw new HttpException(
        'Start date or end date missing',
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = await this.transactionsService.getRoyaltiesStat(
      startDate,
      endDate,
    );
    return data;
  }
}
