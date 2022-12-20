import { Module } from '@nestjs/common';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Share } from './share.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Share])],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}
