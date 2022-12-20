import { ApiProperty } from '@nestjs/swagger';

export class CreateRoyaltyDTO {
  @ApiProperty()
  readonly token_id: number;

  @ApiProperty()
  readonly value: string;
}
