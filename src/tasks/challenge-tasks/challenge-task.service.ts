import { Injectable } from '@nestjs/common';
import { ChallengeTask } from './challenge-task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ChallengeTaskService {
  constructor(
    @InjectRepository(ChallengeTask)
    private challengeTaskRepository: Repository<ChallengeTask>,
  ) {}

  getTasks(): Promise<any> {
    return this.challengeTaskRepository.find();
  }

  getTaskCount(): Promise<any> {
    return this.challengeTaskRepository.count();
  }

  addTemplate(template): Promise<any> {
    return this.challengeTaskRepository.save(template);
  }
}
