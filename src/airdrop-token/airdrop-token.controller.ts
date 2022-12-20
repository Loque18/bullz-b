import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AirdropTokenService } from './airdrop-token.service';
import { ApiResponse, ApiCreatedResponse, ApiBody } from '@nestjs/swagger';
import { AirdropToken } from './airdrop_token.entity';
import { CreateAirdropTokenDTO } from './dto/create-airdrop-token.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
@Controller('airdrop-token')
export class AirdropTokenController {
  constructor(
    private airdropTokenService: AirdropTokenService,
    private authService: AuthService,
  ) {}
  // For now we wont open these api, if needed we'll think about these
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: AirdropToken,
  })
  @ApiBody({
    description: 'createAirdropTokenDTO',
    type: CreateAirdropTokenDTO,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async addAirdrop(
    @Headers('authorization') authorization: string,
    @Body() createAirdropTokenDTO: CreateAirdropTokenDTO,
  ) {
    const isAdmin = this.authService.verifyAdmin(authorization);
    if (isAdmin) {
      console.log(createAirdropTokenDTO);

      const airdrop = await this.airdropTokenService.addAirdropToken(
        createAirdropTokenDTO,
      );
      return airdrop;
    } else {
      throw new HttpException('User is not admin', HttpStatus.UNAUTHORIZED);
    }
  }

  @ApiResponse({
    status: 200,
    type: AirdropToken,
    isArray: true,
    description: 'list airdrops',
  })
  @Get()
  async getAirdropTokens() {
    const airdrops = await this.airdropTokenService.getAirdropTokens();
    return airdrops;
  }
}
