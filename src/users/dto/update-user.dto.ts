import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty()
  readonly id: number;

  @ApiPropertyOptional()
  readonly address: string;

  @ApiPropertyOptional()
  readonly firstname: string;

  @ApiPropertyOptional()
  readonly lastname: string;

  @ApiPropertyOptional()
  readonly email: string;

  @ApiPropertyOptional()
  readonly username: string;

  @ApiPropertyOptional()
  createdNFTCount: number;

  @ApiPropertyOptional()
  ownedNFTCount: number;

  @ApiPropertyOptional()
  readonly bio: string;

  @ApiPropertyOptional()
  readonly avatar_img: string;

  @ApiPropertyOptional()
  readonly back_img: string;

  @ApiPropertyOptional()
  readonly youtube_url: string;

  @ApiPropertyOptional()
  readonly twitch_url: string;

  @ApiPropertyOptional()
  readonly twitter_url: string;

  @ApiPropertyOptional()
  readonly linkedin_url: string;

  @ApiPropertyOptional()
  readonly facebook_url: string;

  @ApiPropertyOptional()
  readonly tiktok_url: string;

  @ApiPropertyOptional()
  readonly discord_url: string;

  @ApiPropertyOptional()
  readonly telegram_url: string;

  @ApiPropertyOptional()
  readonly portfolio_url: string;

  @ApiPropertyOptional()
  readonly following: string[];

  @ApiPropertyOptional()
  readonly follower: string[];

  @ApiPropertyOptional()
  readonly instagram_url: string;

  @ApiPropertyOptional()
  readonly url: string;

  @ApiPropertyOptional()
  readonly totalSold: number;

  @ApiPropertyOptional()
  readonly totalBought: number;
}
