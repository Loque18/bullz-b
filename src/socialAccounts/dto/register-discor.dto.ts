import { ApiProperty } from '@nestjs/swagger';

export class RegisterDiscordDTO {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  redirect_uri: string;
}
