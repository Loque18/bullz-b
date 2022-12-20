import { Module } from '@nestjs/common';
import { ChallengesModule } from './challenges/challenge.module';
import { SubmitsModule } from './submits/submit.module';

@Module({
  imports: [ChallengesModule, SubmitsModule],
  providers: [],
})
export class NFTChallenge {}
