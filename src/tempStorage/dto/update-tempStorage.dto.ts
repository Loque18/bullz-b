import { ApiProperty } from '@nestjs/swagger';

export class UpdateTempStorageDTO {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  status: number;
}
