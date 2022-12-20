import { ApiProperty } from '@nestjs/swagger';

export class CreateOfferDTO {
  @ApiProperty()
  readonly nft_id: number; // orm nft id

  @ApiProperty()
  readonly offer_id: string; // bc id

  @ApiProperty()
  readonly seller: string;

  @ApiProperty()
  readonly collection: string;

  @ApiProperty()
  readonly assetId: string; // NFT bc id

  @ApiProperty()
  readonly token: string; // erc20 address

  @ApiProperty()
  readonly isEther: boolean;

  @ApiProperty()
  readonly price: number;

  @ApiProperty()
  readonly isForSell: boolean;

  @ApiProperty()
  readonly supply: number;

  @ApiProperty()
  readonly isForAuction: boolean;

  @ApiProperty()
  readonly expiresAt: number;

  @ApiProperty()
  readonly currency: string;

  @ApiProperty()
  readonly isSold: boolean;

  @ApiProperty()
  readonly shareIndex: number;

  @ApiProperty()
  readonly auctionStartTime: number;
}
