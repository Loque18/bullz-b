import { ApiProperty } from '@nestjs/swagger';

export class CreateLastBlockDTO {
  @ApiProperty()
  readonly event_name: string;

  @ApiProperty()
  readonly chain_id: number;

  @ApiProperty()
  readonly last_fetch_block: string;
}
