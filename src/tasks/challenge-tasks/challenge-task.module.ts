import { Module } from '@nestjs/common';
import { ChallengeTaskController } from './challenge-task.controller';
import { ChallengeTaskService } from './challenge-task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeTask } from './challenge-task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChallengeTask])],
  controllers: [ChallengeTaskController],
  providers: [ChallengeTaskService],
})
export class ChallengeTaskModule {}
