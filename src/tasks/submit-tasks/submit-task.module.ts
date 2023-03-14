import { Module } from '@nestjs/common';
import { SubmitTaskController } from './submit-task.controller';
import { SubmitTaskService } from './submit-task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmitTask } from './submit-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubmitTask])],
  controllers: [SubmitTaskController],
  providers: [SubmitTaskService],
  exports: [SubmitTaskService],
})
export class SubmitTaskModule {}
