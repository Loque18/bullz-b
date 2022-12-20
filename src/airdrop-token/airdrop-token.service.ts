import { Injectable } from '@nestjs/common';
import { AirdropToken } from './airdrop_token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAirdropTokenDTO } from './dto/create-airdrop-token.dto';

@Injectable()
export class AirdropTokenService {
  constructor(
    @InjectRepository(AirdropToken)
    private airdropTokenRepository: Repository<AirdropToken>,
  ) {}

  addAirdropToken(createAirdropTokenDto: CreateAirdropTokenDTO): Promise<any> {
    return this.airdropTokenRepository.save(createAirdropTokenDto);
  }

  getAirdropTokens(): Promise<any> {
    return this.airdropTokenRepository.find();
  }
}
