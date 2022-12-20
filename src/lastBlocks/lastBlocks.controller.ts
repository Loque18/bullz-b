import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LastBlocksService } from './lastBlocks.service';
import { CreateLastBlockDTO } from './dto/create-lastBlock.dto';
import { UpdateLasBlockDTO } from './dto/update-lastBlock.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LastBlock } from './lastBlock.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiTags('LastBlocks')
@Controller('lastblocks')
export class LastBlocksController {
  constructor(private lastBlocksService: LastBlocksService) {}
}
