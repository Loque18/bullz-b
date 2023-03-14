import { Module } from '@nestjs/common';
import { TaskTemplateController } from './task-template.controller';
import { TaskTemplateService } from './task-template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskTemplate } from './task-template.entity';
import { DefaultTemplates } from './task-template.default';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTemplate])],
  controllers: [TaskTemplateController],
  providers: [TaskTemplateService, DefaultTemplates],
})
export class TaskTemplateModule {}
