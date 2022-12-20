import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { NftsModule } from 'src/nfts/nft.module';
import { Like } from './like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UsersModule, NftsModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
