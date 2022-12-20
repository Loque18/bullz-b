import { ApiProperty } from '@nestjs/swagger';

export class CreateTempStorageDTO {
  @ApiProperty()
  readonly eventId: string;

  @ApiProperty()
  readonly event_name: string;

  @ApiProperty()
  readonly user_id: string;

  @ApiProperty()
  readonly json_string: string;
}
