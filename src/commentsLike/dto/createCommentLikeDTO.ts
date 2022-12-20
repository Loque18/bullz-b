import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentLikeDTO {
  @ApiProperty()
  user: any;

  @ApiProperty()
  comment: any;
}
