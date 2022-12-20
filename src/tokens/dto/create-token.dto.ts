import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDTO {
  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly symbol: string;

  @ApiProperty()
  readonly chain_id: string;

  @ApiProperty()
  readonly decimal: number;

  @ApiProperty()
  readonly user: string;

  @ApiProperty()
  readonly balance: number;
}
