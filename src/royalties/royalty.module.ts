import { Module } from '@nestjs/common';
import { RoyaltysController } from './royalty.controller';
import { RoyaltysService } from './royalty.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Royalty } from './royalty.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Royalty])],
  controllers: [RoyaltysController],
  providers: [RoyaltysService],
})
export class RoyaltysModule {}
