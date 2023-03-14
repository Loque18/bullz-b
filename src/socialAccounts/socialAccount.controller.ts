import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SocialAccountService } from './socilaAccount.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SocialAccount } from './socilaAccount.entity';
import { RegisterDiscordDTO } from './dto/register-discor.dto';
import { VerifyJoinDTO } from './dto/verify-join.dto';
import { UsersService } from 'src/users/users.service';
import { SubmitTaskService } from 'src/tasks/submit-tasks/submit-task.service';
import { RegisterTelegramDTO } from './dto/register-telegram.dto';

@ApiTags('SocialAccount')
@Controller('socials')
export class SocialAccountController {
  constructor(
    private socialAccountService: SocialAccountService,
    private userService: UsersService,
    private submitTaskService: SubmitTaskService,
  ) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: SocialAccount,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/register-discord')
  async registerDiscord(@Body() registerDiscordDTO: RegisterDiscordDTO) {
    const userData = await this.socialAccountService.fetchUser(
      registerDiscordDTO,
    );
    const existingUser = await this.socialAccountService.getUser(
      registerDiscordDTO.user_id,
      'discord',
    );

    if (existingUser) {
      const socialAccountData = {
        id: existingUser.id,
        access_token: userData.token.access_token,
        refresh_token: userData.token.refresh_token,
        token_type: userData.token.token_type,
        expires_in:
          Math.ceil(new Date().getTime() / 1000) +
          userData.token.expires_in -
          100,
        social_user_id: userData.user.id,
        social_user_name: userData.user.username,
      };
      await this.socialAccountService.update(socialAccountData);
      const user = {
        id: registerDiscordDTO.user_id,
        discord_url: `https://discord.com/users/${userData.user.id}`,
      };
      await this.userService.updateUser(user);
      return this.socialAccountService.getUser(
        registerDiscordDTO.user_id,
        'discord',
      );
    } else {
      const socialAccountData = {
        user_id: registerDiscordDTO.user_id,
        social_user_id: userData.user.id,
        social_user_name: userData.user.username,
        access_token: userData.token.access_token,
        social_name: 'discord',
        refresh_token: userData.token.refresh_token,
        token_type: userData.token.token_type,
        expires_in:
          Math.ceil(new Date().getTime() / 1000) +
          userData.token.expires_in -
          100,
      };
      const insert = await this.socialAccountService.add(socialAccountData);
      const user = {
        id: registerDiscordDTO.user_id,
        discord_url: `https://discord.com/users/${userData.user.id}`,
      };
      await this.userService.updateUser(user);
      return insert;
    }
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/verify-discord-join')
  async verifyDiscord(@Body() verifyDiscordJoinDTO: VerifyJoinDTO) {
    const submitTask = await this.submitTaskService.getSubmitTasksById(
      verifyDiscordJoinDTO.submit_task_id,
    );

    // console.log('submitTask', submitTask);
    const socialData = await this.socialAccountService.getUser(
      submitTask.submitted_by.id,
      'discord',
    );
    console.log('socialData', socialData);
    if (!socialData) {
      return { verified: false, message: 'user not connected to discord' };
    }

    if (socialData.expires_in < Math.ceil(new Date().getTime() / 1000)) {
      const newToken = await this.socialAccountService.getRefreshAccessToken(
        socialData.refresh_token,
      );

      const socialAccountData = {
        id: socialData.id,
        access_token: newToken.access_token,
        refresh_token: newToken.refresh_token,
        expires_in:
          Math.ceil(new Date().getTime() / 1000) + newToken.expires_in - 100,
      };
      await this.socialAccountService.update(socialAccountData);
      socialData.access_token = newToken.access_token;
    }

    const parts = submitTask.challenge_task.url_text.split('/');
    const serverid = parts[parts.length - 1];
    const verify = await this.socialAccountService.verifyDiscordJoin(
      socialData.token_type,
      socialData.access_token,
      serverid,
    );
    if (verify) {
      const submitted = {
        id: submitTask.id,
        isVerified: true,
      };
      await this.submitTaskService.update(submitted);
      return { verified: true, data: verifyDiscordJoinDTO };
    } else {
      return { verified: false, message: 'user not joined the discord server' };
    }
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: SocialAccount,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/register-telegram')
  async registerTelegram(@Body() registerTelegramDTO: RegisterTelegramDTO) {
    registerTelegramDTO.social_name = 'telegram';
    const userData = await this.socialAccountService.add(registerTelegramDTO);

    if (userData) {
      const update = await this.userService.updateUser({
        id: registerTelegramDTO.user_id,
        telegram_url: `https://t.me/${registerTelegramDTO.social_user_name}`,
      });
      if (update) {
        userData.telegram_url = `https://t.me/${registerTelegramDTO.social_user_name}`;
      }
    }
    return userData;
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Object,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/verify-telegram-join')
  async verifyTelegram(@Body() verifyTelegramJoinDTO: VerifyJoinDTO) {
    const submitTask = await this.submitTaskService.getSubmitTasksById(
      verifyTelegramJoinDTO.submit_task_id,
    );

    console.log('submitTask', submitTask);
    const socialData = await this.socialAccountService.getUser(
      submitTask.submitted_by.id,
      'telegram',
    );
    console.log('socialData', socialData);
    if (!socialData) {
      return { verified: false, message: 'user not connected to telegram' };
    }
    const parts = submitTask.challenge_task.url_text.split('/');
    const chat_id = '@' + parts[parts.length - 1];

    try {
      const chatMember = await this.socialAccountService.getChatMember(
        socialData.social_user_id,
        chat_id,
      );
      console.log('chatMember', chatMember);
      if (chatMember.user) {
        const submitted = {
          id: submitTask.id,
          isVerified: true,
        };
        await this.submitTaskService.update(submitted);
        return { verified: true, data: verifyTelegramJoinDTO };
      } else {
        return { verified: false, message: 'User not joined.' };
      }
    } catch (error) {
      console.log('error', error);
      return { verified: false, message: error.message };
    }
  }
}
