import { ApiProperty } from '@nestjs/swagger';

export class FilterDTO {
  @ApiProperty()
  readonly nftType: string;

  @ApiProperty()
  readonly collectionType: string;

  @ApiProperty()
  readonly saleType: string;

  @ApiProperty()
  readonly priceRange: string;

  @ApiProperty()
  readonly currency: boolean;

  @ApiProperty()
  readonly sortBy: boolean;

  @ApiProperty()
  readonly chain_id: number;
}
