import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTokenDTO {
  @ApiProperty()
  readonly id: number;

  @ApiPropertyOptional()
  readonly address: string;

  @ApiPropertyOptional()
  readonly name: string;

  @ApiPropertyOptional()
  readonly symbol: string;

  @ApiPropertyOptional()
  readonly chain_id: string;

  @ApiPropertyOptional()
  readonly decimal: number;

  @ApiPropertyOptional()
  readonly user: string;

  @ApiPropertyOptional()
  readonly balance: number;
}
