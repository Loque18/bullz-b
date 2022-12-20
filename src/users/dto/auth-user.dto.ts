import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDTAO {
  @ApiProperty()
  signature: string;

  @ApiProperty()
  address: string;

  
}
