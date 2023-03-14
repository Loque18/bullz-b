import { ApiProperty } from '@nestjs/swagger';

export class RegisterTelegramDTO {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  social_user_id: string;

  @ApiProperty()
  social_user_name: string;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  social_name: string;
}
