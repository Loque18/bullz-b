import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UpdateNftDTO {
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
  readonly id: number;

  @ApiPropertyOptional()
  readonly assetId: string;

  @ApiPropertyOptional()
  readonly uri: string;

  @ApiPropertyOptional()
  readonly contractType: string;

  @ApiPropertyOptional()
  readonly collection: string;

  @ApiPropertyOptional()
  readonly isForSell: boolean;

  @ApiPropertyOptional()
  readonly isForAuction: boolean;

  @ApiPropertyOptional()
  readonly airdropped: boolean;

  @ApiPropertyOptional()
  readonly holder: string;

  @ApiPropertyOptional()
  readonly sold: number;

  @ApiPropertyOptional()
  readonly supply: number;

  @ApiPropertyOptional()
  readonly totalSupply: number;

  @ApiProperty()
  readonly totalCommentCount: number;

  @ApiPropertyOptional()
  readonly nftType: string;

  @ApiPropertyOptional()
  readonly creator: string;

  @ApiPropertyOptional()
  readonly likes: number;

  @ApiPropertyOptional()
  readonly shareIndex: number;

  @ApiPropertyOptional()
  readonly views: number;

  @ApiPropertyOptional()
  readonly collabStart: string;

  @ApiPropertyOptional()
  readonly collabEnd: string;

  @ApiPropertyOptional()
  readonly resale: boolean;

  @ApiPropertyOptional()
  readonly collectionType: string;

  @ApiPropertyOptional()
  readonly externalLink: string;

  @ApiPropertyOptional()
  readonly dFile: string;

  @ApiPropertyOptional()
  readonly resaleCurrency: string;

  @ApiPropertyOptional()
  readonly loyaltyPercentage: string;

  @ApiPropertyOptional()
  readonly eventOrganizer: string;

  @ApiPropertyOptional()
  readonly eventType: string;

  @ApiPropertyOptional()
  readonly eventMode: string;

  @ApiPropertyOptional()
  readonly eventVenue: string;

  @ApiPropertyOptional()
  readonly eventConferenceLink: string;

  @ApiPropertyOptional()
  readonly eventStartTime: string;

  @ApiPropertyOptional()
  readonly eventEndTime: string;

  @ApiPropertyOptional()
  readonly eventUnblockContent: string;

  @ApiPropertyOptional()
  readonly fileType: string;

  @ApiPropertyOptional()
  readonly totalTradingAmount: number;
}
