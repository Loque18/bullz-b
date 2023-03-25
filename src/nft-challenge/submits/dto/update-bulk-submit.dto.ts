import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBulkSubmitDTO {
  @ApiProperty()
  idList: string[];

  @ApiProperty()
  txHash: string;

  @ApiProperty()
  failedMessage: string;

  @ApiPropertyOptional()
  status: string;

  @ApiProperty()
  checkingTime: number;

  @ApiProperty()
  airdropTime: number;
}
