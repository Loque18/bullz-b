import { ApiProperty } from '@nestjs/swagger';

export class UpdateNftScannerDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: string;

  @ApiProperty()
  last_updated: Date;

  @ApiProperty()
  chain_id: number;

  @ApiProperty()
  asset_type: number;
}
