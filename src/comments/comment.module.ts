import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { NftsModule } from 'src/nfts/nft.module';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, NftsModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
