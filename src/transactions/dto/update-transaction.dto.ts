import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDTO {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  hash: string;

  @ApiProperty()
  purpose: string; //(airdrop, direct_sale, accept_bid)

  @ApiProperty()
  chain_id: number;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  airdrop_fee_token: string;

  @ApiProperty()
  airdrop_fee_currency: string;

  @ApiProperty()
  airdrop_fee: number;

  @ApiProperty()
  airdrop_fee_usd: number;

  @ApiProperty()
  royalty_token: string;

  @ApiProperty()
  royalty_currency: string;

  @ApiProperty()
  royalty: number;

  @ApiProperty()
  royalty_usd: number;

  @ApiProperty()
  admin_fee_token: string;

  @ApiProperty()
  admin_fee_currency: string;

  @ApiProperty()
  admin_fee: number;

  @ApiProperty()
  admin_fee_usd: number;

  @ApiProperty()
  challenge_id: number;

  @ApiProperty()
  nft_id: number;

  @ApiProperty()
  offer_id: number;
}
