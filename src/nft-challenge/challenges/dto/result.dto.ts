import { Challenge } from '../challenge.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResultDto {
  @ApiProperty()
  data: Challenge[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalCount: number;
}
