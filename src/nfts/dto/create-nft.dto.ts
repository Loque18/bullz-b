import { ApiProperty } from '@nestjs/swagger';

export class CreateNftDTO {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty()
  readonly file: string;

  @ApiProperty()
  readonly cover: string;

  @ApiProperty()
  readonly type: string;

  @ApiProperty()
  readonly expiry: string;

  @ApiProperty()
  readonly assetId: string;

  @ApiProperty()
  readonly uri: string;

  @ApiProperty()
  readonly contractType: string;

  @ApiProperty()
  readonly collection: string;

  @ApiProperty()
  readonly isForSell: boolean;

  @ApiProperty()
  readonly isForAuction: boolean;

  @ApiProperty()
  readonly chain_id: number;

  @ApiProperty()
  readonly airdropped: boolean;

  @ApiProperty()
  readonly holder: string;

  @ApiProperty()
  readonly sold: number;

  @ApiProperty()
  readonly supply: number;

  @ApiProperty()
  readonly totalSupply: number;

  @ApiProperty()
  readonly totalCommentCount: number;

  @ApiProperty()
  readonly lockedData: string;

  @ApiProperty()
  readonly nftType: string;

  @ApiProperty()
  readonly creator: string;

  @ApiProperty()
  readonly likes: number;

  @ApiProperty()
  readonly shareIndex: number;

  @ApiProperty()
  readonly views: number;

  @ApiProperty()
  readonly collabStart: string;

  @ApiProperty()
  readonly collabEnd: string;

  @ApiProperty()
  readonly resale: boolean;

  @ApiProperty()
  readonly collectionType: string;

  @ApiProperty()
  readonly externalLink: string;

  @ApiProperty()
  readonly dFile: string;

  @ApiProperty()
  readonly instagramUrl: string;

  @ApiProperty()
  readonly resaleCurrency: string;

  @ApiProperty()
  readonly loyaltyPercentage: string;

  @ApiProperty()
  readonly eventOrganizer: string;

  @ApiProperty()
  readonly eventType: string;

  @ApiProperty()
  readonly eventMode: string;

  @ApiProperty()
  readonly eventVenue: string;

  @ApiProperty()
  readonly eventConferenceLink: string;

  @ApiProperty()
  readonly eventStartTime: string;

  @ApiProperty()
  readonly eventEndTime: string;

  @ApiProperty()
  readonly eventUnblockContent: string;

  @ApiProperty()
  readonly fileType: string;

  @ApiProperty()
  readonly totalTradingAmount: number;
}
