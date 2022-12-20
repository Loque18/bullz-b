import { Module } from '@nestjs/common';
import { ReportController } from './reports.controller';
import { ReportsService } from './reports.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { UsersModule } from 'src/users/users.module';
import { CollectionModule } from 'src/collection/collection.module';
import { NftsModule } from 'src/nfts/nft.module';
import { ChallengesModule } from 'src/nft-challenge/challenges/challenge.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    UsersModule,
    CollectionModule,
    NftsModule,
    ChallengesModule,
  ],
  controllers: [ReportController],
  providers: [ReportsService],
})
export class ReportsModule {}
