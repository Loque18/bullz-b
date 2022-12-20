import { Module } from '@nestjs/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bid.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from './bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bid])],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
