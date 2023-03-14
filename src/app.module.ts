import { Module, HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { NftsModule } from './nfts/nft.module';
import { RoyaltysModule } from './royalties/royalty.module';
import { OffersModule } from './offers/offer.module';
import { BidsModule } from './bids/bid.module';
import { LikeModule } from './likes/like.module';
import { CollectionModule } from './collection/collection.module';
import { CommentModule } from './comments/comment.module';
import { CommentLikeModule } from './commentsLike/commentLike.module';
import { NFTChallenge } from './nft-challenge/nft-challenge.module';
import { AuthModule } from './auth/auth.module';
import { AirdropModule } from './airdrop/airdrop.module';
import { AirdropTokenModule } from './airdrop-token/airdrop-token.module';
import { SpotlightsModule } from './spotlight/spotlight.module';
import { ReportsModule } from './reports/reports.module';
import { OauthService } from './auth/oauth-promise';
import { NftScannerModule } from './nft-scanner/nft-scanner.module';
import { LastBlocksModule } from './lastBlocks/lastBlocks.module';
import { TempStorageModule } from './tempStorage/tempStorage.module';
import { TokensModule } from './tokens/tokens.module';
import { TransactionsModule } from './transactions/transaction.module';
import { ShareModule } from './shares/share.module';
import { PhylloUsersModule } from './phylloUser/phylloUsers.module';
import { Tasks } from './tasks/tasks.module';
import { SocialAccountModule } from './socialAccounts/socialAccount.module';
// console.log('process.env.POSTGRES_HOST', process.env.POSTGRES_HOST);

@Module({
  imports: [
    NFTChallenge,
    UsersModule,
    NftsModule,
    RoyaltysModule,
    OffersModule,
    BidsModule,
    LikeModule,
    CollectionModule,
    CommentModule,
    CommentLikeModule,
    SpotlightsModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    HttpModule,
    AuthModule,
    AirdropModule,
    AirdropTokenModule,
    ReportsModule,
    NftScannerModule,
    LastBlocksModule,
    TempStorageModule,
    TokensModule,
    TransactionsModule,
    ShareModule,
    PhylloUsersModule,
    Tasks,
    SocialAccountModule,
  ],
  controllers: [AppController],
  providers: [AppService, OauthService],
})
export class AppModule {}
