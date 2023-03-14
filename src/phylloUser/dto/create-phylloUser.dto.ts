import { ApiProperty } from '@nestjs/swagger';

export class CreatePhylloUserDTO {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  phyllo_user_id: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  platform_id: string;

  @ApiProperty()
  phyllodata: string;
}
