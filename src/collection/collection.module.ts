import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './collection.entity';
import { UsersModule } from 'src/users/users.module';
import { NftsModule } from 'src/nfts/nft.module';
import { AuthModule } from 'src/auth/auth.module';
import { DefaultCollections } from './collection.default';
@Module({
  imports: [
    TypeOrmModule.forFeature([Collection]),
    UsersModule,
    NftsModule,
    AuthModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService, DefaultCollections],
  exports: [CollectionService],
})
export class CollectionModule {}
