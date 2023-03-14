import { Module } from '@nestjs/common';
import { TaskTemplateModule } from './task-templates/task-template.module';
import { ChallengeTaskModule } from './challenge-tasks/challenge-task.module';
import { SubmitTaskModule } from './submit-tasks/submit-task.module';

@Module({
  imports: [TaskTemplateModule, ChallengeTaskModule, SubmitTaskModule],
  providers: [],
})
export class Tasks {}
