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
import { SubmitsService } from './submit.service';
import { CreateSubmitDTO } from './dto/create-submit.dto';
import { UpdateSubmitDTO } from './dto/update-submit.dto';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { Submit } from './submit.entity';
import { SubmitsModule } from './submit.module';

class DeleteSubmit {
  @ApiProperty()
  headers: any;

  @ApiProperty()
  data: {
    id: string;
  };
}

@Controller('submits')
export class SubmitsController {
  constructor(private submitsService: SubmitsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: Submit,
    isArray: true,
    description: 'number of submits',
  })
  async getSubmits() {
    const submits = await this.submitsService.getSubmits();
    return submits;
  }

  @ApiParam({ name: 'challenge_id' })
  @ApiParam({ name: 'order', enum: ['ASC', 'DESC'] })
  @ApiQuery({ description: 'paginationDto', type: PaginationDto })
  @Get('/getbychallenge/:challenge_id/orderBy/:order/filters')
  @ApiResponse({
    status: 200,
    type: Submit,
    isArray: true,
    description: 'number of submits',
  })
  async getSubmitsByChallenge(
    @Param('challenge_id') challenge_id,
    @Param('order') order,
    @Query() paginationDto: any,
  ): Promise<PaginatedResultDto> {
    const { page, limit, ...filters } = paginationDto;
    paginationDto.page = Number(paginationDto.page);
    paginationDto.limit = Number(paginationDto.limit);

    return this.submitsService.getSubmitsByChallenge(
      challenge_id,
      {
        ...paginationDto,
        limit: paginationDto.limit,
      },
      filters,
      order,
    );
  }

  @ApiParam({ name: 'user_id' })
  @ApiParam({ name: 'nft_id' })
  @Get('/filter/user/:user_id/nft/:nft_id')
  @ApiResponse({
    status: 200,
    type: Submit,
    isArray: true,
    description: 'number of submits',
  })
  async getbyUserAndNFT(@Param('user_id') user_id, @Param('nft_id') nft_id) {
    console.log(user_id + ' ' + nft_id);
    const submits = await this.submitsService.getbyUserAndNFT(user_id, nft_id);
    return submits;
  }

  @ApiBody({
    description: 'CreateSubmitDTO',
    type: CreateSubmitDTO,
  })
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Submit,
  })
  @Post()
  async addSubmit(@Body() createSubmitDTO: CreateSubmitDTO) {
    const existing = await this.submitsService.getbyUserAndChallenge(
      createSubmitDTO,
    );
    if (existing) {
      throw new HttpException(
        'You already submitted for this challenge',
        HttpStatus.CONFLICT,
      );
    } else {
      const challenges = await this.submitsService.addSubmit(createSubmitDTO);
      return challenges;
    }
  }

  @ApiBody({
    description: 'updateSubmitDTO',
    type: UpdateSubmitDTO,
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  @Put()
  async update(@Body() updateSubmitDTO: UpdateSubmitDTO) {
    const submit = await this.submitsService.updateSubmit(updateSubmitDTO);
    return submit;
  }

  @ApiBody({
    description: 'delete submit',
    type: String,
  })
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteSubmit(@Body() submit: DeleteSubmit) {
    console.log(submit);
    const submits = await this.submitsService.remove(submit.data.id);
    return submits;
  }
}
