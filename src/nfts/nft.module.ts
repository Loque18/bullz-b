import { Module, forwardRef } from '@nestjs/common';
import { NftsController } from './nfts.controller';
import { NftsService } from './nft.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from './nft.entity';
import { UsersModule } from 'src/users/users.module';
import { SpotlightsModule } from 'src/spotlight/spotlight.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nft]),
    forwardRef(() => UsersModule),
    SpotlightsModule,
    AuthModule,
  ],
  controllers: [NftsController],
  providers: [NftsService],
  exports: [NftsService],
})
export class NftsModule {}
