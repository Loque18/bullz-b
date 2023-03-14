import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDTO {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  platform_id: string;
}
