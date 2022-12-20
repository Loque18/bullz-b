import { Module } from '@nestjs/common';
import { CommentLikeController } from './commentLike.controller';
import { CommentLikeService } from './commentLike.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { NftsModule } from 'src/nfts/nft.module';
import { CommentLike } from './commentLike.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommentLike]), UsersModule, NftsModule],
  controllers: [CommentLikeController],
  providers: [CommentLikeService],
})
export class CommentLikeModule {}
