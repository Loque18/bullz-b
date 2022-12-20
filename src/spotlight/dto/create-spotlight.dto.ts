import { ApiProperty } from '@nestjs/swagger';

export class CreateSpotlightDTO {
  @ApiProperty()
  readonly challenge_id: string;
}
