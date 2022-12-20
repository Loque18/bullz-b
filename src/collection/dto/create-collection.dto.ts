import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionDTO {
  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  readonly image: string;

  @ApiProperty()
  readonly coverImage: string;

  @ApiProperty()
  readonly chain_id: number;

  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly coverFileType: string;

  @ApiProperty()
  readonly totalVolume: number;
}
