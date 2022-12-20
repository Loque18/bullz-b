import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOfferDTO {
  @ApiProperty()
  readonly id: number;

  @ApiPropertyOptional()
  readonly offer_id: string;

  @ApiPropertyOptional()
  readonly seller: string;

  @ApiPropertyOptional()
  readonly collection: string;

  @ApiPropertyOptional()
  readonly assetId: string;

  @ApiPropertyOptional()
  readonly token: string;

  @ApiPropertyOptional()
  readonly isEther: boolean;

  @ApiPropertyOptional()
  readonly price: number;

  @ApiPropertyOptional()
  readonly isForSell: boolean;

  @ApiPropertyOptional()
  readonly supply: number;

  @ApiPropertyOptional()
  readonly isForAuction: boolean;

  @ApiPropertyOptional()
  readonly expiresAt: number;

  @ApiPropertyOptional()
  readonly currency: string;

  @ApiPropertyOptional()
  readonly isSold: boolean;

  @ApiPropertyOptional()
  readonly shareIndex: number;

  @ApiPropertyOptional()
  readonly auctionStartTime: number;
}
