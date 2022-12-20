import { ApiProperty } from '@nestjs/swagger';

export class UpdateLasBlockDTO {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly event_name: string;

  @ApiProperty()
  readonly last_fetch_block: number;

  @ApiProperty()
  readonly is_deleted: boolean;
}
