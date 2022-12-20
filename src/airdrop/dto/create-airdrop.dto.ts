import { ApiProperty } from '@nestjs/swagger';

export class CreateAirdropDTO {
  @ApiProperty()
  readonly email_address: string;

  @ApiProperty()
  readonly eth_address: string;

  @ApiProperty()
  readonly status: number;
}
