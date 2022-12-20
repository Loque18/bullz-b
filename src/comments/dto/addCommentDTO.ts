import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDTO {
  @ApiProperty()
  nft: number;

  @ApiProperty()
  challenge: number;

  @ApiProperty()
  user: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  liked: boolean;
}
