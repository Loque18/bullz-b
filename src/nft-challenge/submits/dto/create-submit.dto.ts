import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmitDTO {
  @ApiProperty()
  challenge_id: number;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  linkPreview: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  hasWin: boolean;
}
