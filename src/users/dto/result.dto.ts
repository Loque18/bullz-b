import { User } from '../users.entity';
import { ApiProperty } from '@nestjs/swagger';
export class PaginatedResultDto {
  @ApiProperty()
  data: User[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalCount: number;
}
