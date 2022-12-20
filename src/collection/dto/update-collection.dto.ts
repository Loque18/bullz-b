import { ApiProperty } from '@nestjs/swagger';

export class UpdateCollectionDTO {
  @ApiProperty()
  readonly id: number;

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
  readonly type: string;

  @ApiProperty()
  readonly coverFileType: string;

  @ApiProperty()
  readonly totalVolume: number;
}
