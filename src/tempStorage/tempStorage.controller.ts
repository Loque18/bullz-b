import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TempStorageService } from './tempStorage.service';
import { CreateTempStorageDTO } from './dto/create-tempStorage.dto';
import { UpdateTempStorageDTO } from './dto/update-tempStorage.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { TempStorage } from './tempStorage.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiTags('TempStorage')
@Controller('tempstorage')
export class TempStorageController {
  constructor(private tempStorageService: TempStorageService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: TempStorage,
  })
  async addTempStorage(@Body() createTempStorageDTO: CreateTempStorageDTO) {
    const tempStorage = await this.tempStorageService.add(createTempStorageDTO);
    return tempStorage;
  }

  // @UseGuards(JwtAuthGuard)
  @Put()
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: UpdateResult,
  })
  async update(@Body() updateTempStorageDTO: UpdateTempStorageDTO) {
    const tempStorage = await this.tempStorageService.update(
      updateTempStorageDTO,
    );
    return tempStorage;
  }

  @Get('/getById/:id')
  @ApiResponse({
    status: 200,
    type: TempStorage,
    isArray: false,
    description: 'storage data',
  })
  async getStorageById(@Param('id') id) {
    try {
      const storage = await this.tempStorageService.getById(id);
      return storage;
    } catch (exception) {
      throw new HttpException('no data found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/getByEventId/:id')
  @ApiResponse({
    status: 200,
    type: TempStorage,
    isArray: false,
    description: 'storage data',
  })
  async getStorageByEventId(@Param('id') id) {
    try {
      const storage = await this.tempStorageService.getByEventId(id);
      return storage;
    } catch (exception) {
      throw new HttpException('no data found', HttpStatus.NOT_FOUND);
    }
  }
}
