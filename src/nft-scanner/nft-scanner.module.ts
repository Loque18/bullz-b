import { Module } from '@nestjs/common';
import { NftScannerController } from './nft-scanner.controller';
import { NftScannerService } from './nft-scanner.service';
import { AlchemyService } from './alchemy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftScanner } from './nft-scanner.entity';
import { UsersModule } from 'src/users/users.module';
import { CollectionModule } from 'src/collection/collection.module';
import { NftsModule } from 'src/nfts/nft.module';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NftScanner]),
    UsersModule,
    CollectionModule,
    NftsModule,
    TokensModule,
  ],
  controllers: [NftScannerController],
  providers: [NftScannerService, AlchemyService],
})
export class NftScannerModule {}
