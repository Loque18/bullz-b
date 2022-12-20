import { ApiProperty } from '@nestjs/swagger';
export class CreateChallengeDTO {
  @ApiProperty()
  challengeId: string; // from smart contracts

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  websiteurl: string;

  @ApiProperty()
  creator_id: string;

  @ApiProperty()
  collection: string;

  @ApiProperty()
  chain_id: number;

  @ApiProperty()
  file: string;

  @ApiProperty()
  cover: string;

  @ApiProperty() //NFT = 1, Token = 2
  asset_type: number;

  @ApiProperty() //erc20 Token address
  tokenAddress: string;

  @ApiProperty()
  assetId: string;

  @ApiProperty()
  amountToAirdrop: number;

  @ApiProperty()
  submissionLimit: number;

  @ApiProperty()
  airdropFee: number;

  @ApiProperty()
  allowResell: boolean;

  @ApiProperty()
  isInstagram: boolean;

  @ApiProperty()
  isTwitter: boolean;

  @ApiProperty()
  isYoutube: boolean;

  @ApiProperty()
  isTwitch: boolean;

  @ApiProperty()
  isTiktok: boolean;

  @ApiProperty()
  challengeStartAt: number;

  @ApiProperty()
  expiresAt: number;

  @ApiProperty()
  airdropStartAt: number;

  @ApiProperty()
  airdropEndAt: number;

  @ApiProperty()
  nft_id: string;

  @ApiProperty()
  token_id: string;

  @ApiProperty()
  totalCommentCount: number;
}
