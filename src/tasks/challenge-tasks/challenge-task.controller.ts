import { Controller, Get } from '@nestjs/common';
import { ChallengeTaskService } from './challenge-task.service';
import { ApiResponse } from '@nestjs/swagger';
import { ChallengeTask } from './challenge-task.entity';

@Controller('challenge-tasks')
export class ChallengeTaskController {
  constructor(private challengeTaskService: ChallengeTaskService) {}

  @ApiResponse({
    status: 200,
    type: ChallengeTask,
    isArray: true,
    description: 'list tasks',
  })
  @Get('/get-tasks')
  async getTasks() {
    const tasks = await this.challengeTaskService.getTasks();
    return tasks;
  }
}
