import { Submit } from '../submit.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResultDto {
  @ApiProperty()
  data: Submit[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalCount: number;
}
