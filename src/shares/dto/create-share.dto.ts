import { ApiProperty } from '@nestjs/swagger';

export class CreateShareDTO {
  @ApiProperty()
  readonly shared_by: string;

  @ApiProperty()
  readonly link: string;

  @ApiProperty()
  readonly share_on: string;
}
