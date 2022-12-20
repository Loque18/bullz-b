import { Module, forwardRef } from '@nestjs/common';
import { SpotlightsController } from './spotlight.controller';
import { SpotlightsService } from './spotlight.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Spotlight } from './spotlight.entity';
// import { AuthModule } from 'src/auth/auth.module';
import { NftsModule } from 'src/nfts/nft.module';
import { ChallengesModule } from 'src/nft-challenge/challenges/challenge.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Spotlight]),
    // forwardRef(() => AuthModule),
    forwardRef(() => NftsModule),
    ChallengesModule,
  ],
  controllers: [SpotlightsController],
  providers: [SpotlightsService],
  exports: [SpotlightsService],
})
export class SpotlightsModule {}
