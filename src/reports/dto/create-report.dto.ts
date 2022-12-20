import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDTO {
  @ApiProperty()
  readonly report_for: string;

  @ApiProperty()
  readonly reporter_id: string;

  @ApiProperty()
  readonly reported_id: string;

  @ApiProperty()
  message: string;
}
