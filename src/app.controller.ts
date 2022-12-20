import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import yaaas from './JSON/yaaas.json';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { OauthService } from './auth/oauth-promise';
import {
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthUserDTAO } from './users/dto/auth-user.dto';
class AuthResult {
  @ApiProperty()
  access_token: string;
}
@Controller()
export class AppController {
  private tokens = {};
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly oauthService: OauthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  /**
   * @dev get json file
   * @param id
   */
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 400, type: String, description: 'wrong Json file' })
  @ApiResponse({ status: 200, type: Array, description: 'list yaaas' })
  @Get('/json/:id')
  async jsonData(@Param('id') id) {
    if (id == 'yaaas.json') return yaaas;
    else return 'wrong Json file';
  }

  @ApiBody({
    description: 'Authenticate user',
    type: AuthUserDTAO,
  })
  @ApiResponse({
    status: 201,
    type: AuthResult,
    description: 'Authenticate a user',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('auth/login')
  async login(@Body() user: AuthUserDTAO) {
    return this.authService.login(user);
  }

  @ApiBody({
    description: 'Authenticate user',
    type: AuthUserDTAO,
  })
  @ApiResponse({
    status: 201,
    type: AuthResult,
    description: 'Authenticate a user',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('auth/admin-login')
  async adminLogin(@Body() user: AuthUserDTAO) {
    return this.authService.adminLogin(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/twitter/request_token')
  async twitterLogin(@Body() body) {
    try {
      const data = await this.oauthService.getOAuthRequestToken(
        body.callbackUrl,
      );
      this.tokens[data['oauth_token']] = data['oauth_token_secret'];
      // console.log('oauth_token', data);
      return {
        oauth_token: data['oauth_token'],
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Post('auth/youtube')
  async youtubeLogin(@Body('access_token') request_token) {
    try {
      return await this.oauthService.getYoutubeInfo(request_token);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/twitter/access_token')
  async twitterAccess(@Body() body) {
    // console.log('body', body);
    try {
      const { oauth_token, oauth_verifier, callbackUrl } = body;

      const oauth_token_secret = this.tokens[oauth_token];

      const data = await this.oauthService.getOAuthAccessToken(
        oauth_token,
        oauth_token_secret,
        oauth_verifier,
        callbackUrl,
      );
      //{oauth_access_token, oauth_access_token_secret}
      return data['results'];
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('auth/instagram/')
  async instagram(@Body() body) {
    // console.log('body', body);
    try {
      const { code, redirect_url } = body;

      const data = await this.oauthService.getInstagramAccessToken(
        code,
        redirect_url,
      );
      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
