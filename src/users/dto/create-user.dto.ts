import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty()
  readonly address: string;

  @ApiProperty()
  readonly firstname: string;

  @ApiProperty()
  readonly lastname: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly bio: string;

  @ApiProperty()
  readonly avatar_img: string;

  @ApiProperty()
  readonly back_img: string;

  @ApiProperty()
  readonly youtube_url: string;

  @ApiProperty()
  readonly twitch_url: string;

  @ApiProperty()
  readonly linkedin_url: string;

  @ApiProperty()
  readonly facebook_url: string;

  @ApiProperty()
  readonly twitter_url: string;

  @ApiProperty()
  readonly tiktok_url: string;

  @ApiProperty()
  readonly portfolio_url: string;

  @ApiProperty()
  readonly following: string[];

  @ApiProperty()
  readonly follower: string[];

  @ApiProperty()
  readonly instagram_url: string;

  @ApiProperty()
  readonly url: string;

  @ApiProperty()
  readonly totalSold: number;

  @ApiProperty()
  readonly totalBought: number;
}
