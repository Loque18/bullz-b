import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TokensService } from './tokens.service';
import { CreateTokenDTO } from './dto/create-token.dto';
import { UpdateTokenDTO } from './dto/update-token.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiProperty,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { UpdateResult, DeleteResult } from 'typeorm';

class DeleteToken {
  @ApiProperty()
  headers: any;

  @ApiProperty()
  data: {
    id: string;
  };
}

@Controller('tokens')
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @Get(':chain_id')
  @ApiResponse({
    status: 200,
    type: UpdateTokenDTO,
    isArray: true,
    description: 'list tokens',
  })
  async getTonkens(@Param('chain_id') chain_id: number) {
    const tokens = await this.tokensService.getTokens(chain_id);
    return tokens;
  }

  @Get('/getbyuser/:user/:chain_id')
  @ApiResponse({
    status: 200,
    type: UpdateTokenDTO,
    isArray: true,
    description: 'list tokens',
  })
  async getTokensByUser(
    @Param('user') user: string,
    @Param('chain_id') chain_id: number,
  ) {
    const tokens = await this.tokensService.getTokensByUser(user, chain_id);
    return tokens;
  }

  @Get('getbyaddress/:address/:chain_id')
  @ApiResponse({
    status: 200,
    type: UpdateTokenDTO,
    isArray: true,
    description: 'list tokens',
  })
  async getByAddress(
    @Param('address') address: string,
    @Param('chain_id') chain_id: number,
  ) {
    const tokens = await this.tokensService.getTokensByAddress(
      address,
      chain_id,
    );
    return tokens;
  }

  @Get('getbyuserandaddress/:user/:address/:chain_id')
  @ApiResponse({
    status: 200,
    type: UpdateTokenDTO,
    isArray: true,
    description: 'list tokens',
  })
  async getByUserAndAddress(
    @Param('user') user: string,
    @Param('address') address: string,
    @Param('chain_id') chain_id: number,
  ) {
    const token = await this.tokensService.getTokenByUserAndAddress(
      user,
      address,
      chain_id,
    );
    return token;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: UpdateTokenDTO,
  })
  async addToken(@Body() createTokenDTO: CreateTokenDTO) {
    const token = await this.tokensService.addToken(createTokenDTO);
    return token;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiResponse({
    description: 'The record has been successfully update.',
    type: UpdateResult,
  })
  async update(@Body() updateTokenDTO: UpdateTokenDTO) {
    const token = await this.tokensService.updateToken(updateTokenDTO);
    return token;
  }

  @ApiBody({
    description: 'Delete token',
    type: DeleteToken,
  })
  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiResponse({
    description: 'The record has been successfully deleted.',
    type: DeleteResult,
  })
  async deleteToken(@Body() token) {
    console.log(token);
    const token_ = await this.tokensService.remove(token.data.id);
    return token_;
  }
}
