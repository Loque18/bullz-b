import { Nft } from '../nft.entity';
import { ApiProperty } from '@nestjs/swagger';
export class PaginatedResultDto {
  @ApiProperty()
  data: Nft[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalCount: number;
}
