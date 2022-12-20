import { ApiProperty } from '@nestjs/swagger';

export class UpdateReportDTO {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly report_for: string;

  @ApiProperty()
  readonly reporter_id: string;

  @ApiProperty()
  readonly reported_id: string;

  @ApiProperty()
  readonly message: string;

  @ApiProperty()
  status: number;
}
