import { Module } from '@nestjs/common';
import { SocialAccountController } from './socialAccount.controller';
import { SocialAccountService } from './socilaAccount.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialAccount } from './socilaAccount.entity';
import { UsersModule } from 'src/users/users.module';
import { SubmitTaskModule } from 'src/tasks/submit-tasks/submit-task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialAccount]),
    UsersModule,
    SubmitTaskModule,
  ],
  controllers: [SocialAccountController],
  providers: [SocialAccountService],
})
export class SocialAccountModule {}
