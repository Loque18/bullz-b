import { ApiProperty } from '@nestjs/swagger';

export class UpdateBidDTO {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly price: string;

  @ApiProperty()
  readonly isWinner: boolean;

  @ApiProperty()
  readonly supply: number;

  @ApiProperty()
  readonly fileUrl: string;
}
