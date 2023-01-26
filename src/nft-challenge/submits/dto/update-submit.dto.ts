import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSubmitDTO {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  link: string;

  @ApiPropertyOptional()
  hasWin: boolean;

  @ApiPropertyOptional()
  status: string;

  @ApiPropertyOptional()
  linkPreview: string;

  @ApiProperty()
  checkingTime: number;

  @ApiProperty()
  airdropTime: number;

  @ApiProperty()
  txHash: string;

  @ApiProperty()
  failedMessage: string;
}
