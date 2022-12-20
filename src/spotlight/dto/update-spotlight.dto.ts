import { ApiProperty } from '@nestjs/swagger';

export class UpdateSpotlightDTO {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  order: number;

  @ApiProperty()
  readonly challenge_id: string;
}
