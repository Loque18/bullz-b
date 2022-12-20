import { ApiProperty } from '@nestjs/swagger';

export class CreateAirdropTokenDTO {
  @ApiProperty()
  readonly nft_id: number;

  @ApiProperty()
  readonly collection_address: string;
}
