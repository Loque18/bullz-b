import { Module } from '@nestjs/common';
import { LastBlocksController } from './lastBlocks.controller';
import { LastBlocksService } from './lastBlocks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LastBlock } from './lastBlock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LastBlock])],
  controllers: [LastBlocksController],
  providers: [LastBlocksService],
})
export class LastBlocksModule {}
