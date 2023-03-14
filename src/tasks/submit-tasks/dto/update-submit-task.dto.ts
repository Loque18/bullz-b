import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubmitTaskDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  file_url: string;

  @ApiProperty()
  external_url: string;

  @ApiProperty()
  answer_text: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isStartClicked: boolean;

  @ApiProperty()
  submit: string;
}
