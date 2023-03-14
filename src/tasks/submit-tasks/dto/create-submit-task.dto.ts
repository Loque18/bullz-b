import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmitTaskDTO {
  @ApiProperty()
  file_url: string;

  @ApiProperty()
  external_url: string;

  @ApiProperty()
  answer_text: string;

  @ApiProperty()
  submitted_by: string;

  @ApiProperty()
  challenge_task: string;

  @ApiProperty()
  isVerified: boolean;
}
