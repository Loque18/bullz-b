import { ApiProperty } from '@nestjs/swagger';

export class CreateBidDTO {
  @ApiProperty()
  readonly offer_id: number;

  @ApiProperty()
  readonly bidder: string;

  @ApiProperty()
  readonly token: string;

  @ApiProperty()
  readonly price: string;

  @ApiProperty()
  readonly supply: number;

  @ApiProperty()
  readonly fileUrl: string;
}
