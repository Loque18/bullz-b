import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SocialAccount } from './socilaAccount.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { RegisterDiscordDTO } from './dto/register-discor.dto';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class SocialAccountService {
  axiosInstance = null;
  bot;
  constructor(
    @InjectRepository(SocialAccount)
    private socialAccountRepository: Repository<SocialAccount>,
    private userService: UsersService,
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: false,
    });
  }

  async fetchUser(registerDiscordDTO: RegisterDiscordDTO): Promise<any> {
    // console.log('registerDiscordDTO', registerDiscordDTO);
    if (registerDiscordDTO.code) {
      const token = await this.fetchAccessToken(
        registerDiscordDTO.code,
        registerDiscordDTO.redirect_uri,
      );
      const user = await this.fetchUserProfile(
        token.token_type,
        token.access_token,
      );
      return { token, user };
    } else {
      throw new HttpException('code must be provided.', HttpStatus.BAD_REQUEST);
    }
  }

  async fetchAccessToken(code: string, redirect_uri: string): Promise<any> {
    try {
      const discord_form = new URLSearchParams();
      discord_form.append('client_id', process.env.DISCORD_CLIENT_ID);
      discord_form.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
      discord_form.append('grant_type', 'authorization_code');
      discord_form.append('redirect_uri', redirect_uri);
      discord_form.append('code', code);
      discord_form.append('scope', 'identify');
      const result = await axios({
        method: 'POST',
        url: 'https://discord.com/api/oauth2/token',
        data: discord_form,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then((response) => {
          console.log(response.data);
          return response.data;
        })
        .catch((err) => {
          console.log(err.response);
          return err;
        });
      // console.log('result', result);
      return result;
    } catch (error) {
      // NOTE: An unauthorized token will not throw an error
      // tokenResponseData.statusCode will be 401
      console.error(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async fetchUserProfile(tokenType: string, accessToken: string): Promise<any> {
    const userData = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      },
    })
      .then((result) => result.json())
      .then((response) => {
        console.log('response', response);
        return response;
      })
      .catch(console.error);
    return userData;
  }

  getUser(user_id: string, social_name: string): Promise<any> {
    return this.socialAccountRepository
      .createQueryBuilder('SocialAccount')
      .where('SocialAccount.user_id = :user_id', { user_id: user_id })
      .andWhere('SocialAccount.social_name = :social_name', {
        social_name: social_name,
      })
      .getOne();
  }

  update(socialAccount): Promise<any> {
    return this.socialAccountRepository.update(socialAccount.id, socialAccount);
  }

  add(socialData): Promise<any> {
    return this.socialAccountRepository.save(socialData);
  }

  async verifyDiscordJoin(
    token_type: string,
    access_token: string,
    serverId: string,
  ): Promise<any> {
    const result = await fetch(`https://discord.com/api/invites/${serverId}`, {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    })
      .then((result) => result.json())
      .then((response) => {
        // console.log('response2', response);

        return fetch(
          `https://discord.com/api/users/@me/guilds/${response.guild.id}/member`,
          {
            headers: {
              authorization: `${token_type} ${access_token}`,
            },
          },
        )
          .then((result) => result.json())
          .then((response) => {
            // console.log('response4', response);
            if (response) {
              return response?.user?.username;
            }
          })
          .catch((error) => {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          });
      })
      .catch((error) => {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      });
    return result;
  }

  async getRefreshAccessToken(refresh_token: string): Promise<any> {
    console.log('refresh_token', refresh_token);
    const discord_form = new URLSearchParams();
    discord_form.append('client_id', process.env.DISCORD_CLIENT_ID);
    discord_form.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
    discord_form.append('grant_type', 'refresh_token');
    discord_form.append('refresh_token', refresh_token);

    const result = await axios({
      method: 'POST',
      url: 'https://discord.com/api/oauth2/token',
      data: discord_form,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });
    return result;
  }

  async getChatMember(user_id, chat_id): Promise<any> {
    return this.bot.getChatMember(chat_id, user_id);
  }

  async getBotInfo(): Promise<any> {
    const result = await axios({
      method: 'GET',
      url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });
    return result;
  }
}
