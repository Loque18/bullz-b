import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChallengeDTO {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  websiteurl: string;

  @ApiPropertyOptional()
  file: string;

  @ApiPropertyOptional()
  cover: string;

  @ApiPropertyOptional() //NFT = 1, Token = 2
  asset_type: number;

  @ApiPropertyOptional() //erc20 Token address
  tokenAddress: string;

  @ApiPropertyOptional()
  collection: string;

  @ApiPropertyOptional()
  assetId: string;

  @ApiPropertyOptional()
  submissionLimit: number;

  @ApiProperty()
  amountToAirdrop: number;

  @ApiPropertyOptional()
  airdropFee: number;

  @ApiPropertyOptional()
  allowResell: boolean;

  @ApiProperty()
  isInstagram: boolean;

  @ApiProperty()
  isTwitter: boolean;

  @ApiPropertyOptional()
  isYoutube: boolean;

  @ApiPropertyOptional()
  isTwitch: boolean;

  @ApiPropertyOptional()
  isTiktok: boolean;

  @ApiPropertyOptional()
  airdropStartAt: number;

  @ApiPropertyOptional()
  airdropEndAt: number;

  @ApiProperty()
  challengeStartAt: number;

  @ApiPropertyOptional()
  expiresAt: number;

  @ApiPropertyOptional()
  status: number;

  @ApiPropertyOptional()
  hidden_status: number;

  @ApiPropertyOptional()
  totalCommentCount: number;
}
