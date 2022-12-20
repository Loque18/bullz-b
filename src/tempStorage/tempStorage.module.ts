import { Module } from '@nestjs/common';
import { TempStorageController } from './tempStorage.controller';
import { TempStorageService } from './tempStorage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TempStorage } from './tempStorage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TempStorage])],
  controllers: [TempStorageController],
  providers: [TempStorageService],
})
export class TempStorageModule {}
