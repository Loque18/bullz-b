import { Collection } from '../collection.entity';
import { ApiProperty } from '@nestjs/swagger';
export class PaginatedResultDto {
  @ApiProperty()
  data: Collection[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalCount: number;
}
