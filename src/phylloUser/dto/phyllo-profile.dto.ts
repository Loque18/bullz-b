import { ApiProperty } from '@nestjs/swagger';

export class PhylloProfileDTO {
  @ApiProperty()
  account_id: string;
}
