import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDTO {
  @ApiProperty()
  readonly assetId: string;
}
