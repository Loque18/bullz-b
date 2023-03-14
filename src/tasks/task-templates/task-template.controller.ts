import { Controller, Get } from '@nestjs/common';
import { TaskTemplateService } from './task-template.service';
import { ApiResponse } from '@nestjs/swagger';
import { TaskTemplate } from './task-template.entity';

@Controller('task-templates')
export class TaskTemplateController {
  constructor(private taskTemplateService: TaskTemplateService) {}

  @ApiResponse({
    status: 200,
    type: TaskTemplate,
    isArray: true,
    description: 'list tasks',
  })
  @Get('/get-tasks')
  async getTasks() {
    const tasks = await this.taskTemplateService.getTasks();
    return tasks;
  }
}
