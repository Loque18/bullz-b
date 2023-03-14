import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PhylloUsersService } from './phylloUsers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { PhylloUser } from './phylloUser.entity';
import { CreateTokenDTO } from './dto/create-token.dto';
import { PhylloProfileDTO } from './dto/phyllo-profile.dto';
@ApiTags('PhylloUser')
@Controller('phyllo')
export class PhylloUserController {
  constructor(private phylloUserService: PhylloUsersService) {}

  // @ApiResponse({
  //   status: 200,
  //   type: PhylloUser,
  //   isArray: true,
  //   description: 'list phyllo users',
  // })
  // @Get('/')
  // async get() {
  //   const users = await this.phylloUserService.createUser(
  //     'abcd',
  //     new Date().getTime(),
  //   );

  //   // const users = await this.phylloUserService.getUsers();
  //   return users;
  // }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: PhylloUser,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/create-token')
  async createToken(@Body() createTokenDTO: CreateTokenDTO) {
    const token = await this.phylloUserService.createToken(createTokenDTO);
    return token;
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: PhylloUser,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/phyllo-profile')
  async phylloProfile(@Body() phylloProfileDTO: PhylloProfileDTO) {
    const token = await this.phylloUserService.getUserProfile(
      phylloProfileDTO.account_id,
    );
    return token;
  }
}
