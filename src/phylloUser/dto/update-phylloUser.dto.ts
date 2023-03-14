import { ApiProperty } from '@nestjs/swagger';

export class UpdatePhylloUserDTO {
  @ApiProperty()
  id: number;

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

  @ApiProperty()
  status: number;
}
