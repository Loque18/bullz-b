import { Module } from '@nestjs/common';
import { SubmitsController } from './submit.controller';
import { SubmitsService } from './submit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submit } from './submit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submit])],
  controllers: [SubmitsController],
  providers: [SubmitsService],
})
export class SubmitsModule {}
