import { Module } from '@nestjs/common';
import { AirdropController } from './airdrop.controller';
import { AirdropService } from './airdrop.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airdrop } from './airdrop.entity';
import { UsersModule } from 'src/users/users.module';
import { NftsModule } from 'src/nfts/nft.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Airdrop]),
    NftsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AirdropController],
  providers: [AirdropService],
})
export class AirdropModule {}
