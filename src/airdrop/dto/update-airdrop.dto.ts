import { ApiProperty } from '@nestjs/swagger';

export class UpdateAirdropDTO {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly email_address: string;

  @ApiProperty()
  readonly eth_address: string;

  @ApiProperty()
  readonly status: number;
}
