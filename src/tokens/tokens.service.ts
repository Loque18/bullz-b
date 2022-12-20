import { Injectable } from '@nestjs/common';
import { Token } from './token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTokenDTO } from './dto/update-token.dto';
import { CreateTokenDTO } from './dto/create-token.dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
  ) {}

  getTokens(chain_id: number): Promise<any> {
    return this.tokensRepository
      .createQueryBuilder('Token')
      .andWhere('Token.chain_id = :chain_id', { chain_id: chain_id })
      .getMany();
  }

  getTokenByUserAndAddress(
    user: string,
    address: string,
    chain_id: number,
  ): Promise<any> {
    return this.tokensRepository
      .createQueryBuilder('Token')
      .where('LOWER(Token.user) = LOWER(:user)', { user: user })
      .andWhere('LOWER(Token.address) = LOWER(:address)', { address: address })
      .andWhere('Token.chain_id = :chain_id', { chain_id: chain_id })
      .getOne();
  }

  getTokensByAddress(address: string, chain_id: number): Promise<any> {
    return this.tokensRepository
      .createQueryBuilder('Token')
      .where('LOWER(Token.address) = LOWER(:address)', { address: address })
      .andWhere('Token.chain_id = :chain_id', { chain_id: chain_id })
      .getMany();
  }

  getTokensByUser(user: string, chain_id: number): Promise<any> {
    return this.tokensRepository
      .createQueryBuilder('Token')
      .where('LOWER(Token.user) = LOWER(:user)', { user: user })
      .andWhere('Token.chain_id = :chain_id', { chain_id: chain_id })
      .getMany();
  }
  updateToken(updateTokenDTO: UpdateTokenDTO): Promise<any> {
    return this.tokensRepository.update(updateTokenDTO.id, updateTokenDTO);
  }
  addToken(token: CreateTokenDTO): Promise<any> {
    return this.tokensRepository.save(token);
  }

  async remove(id: string): Promise<void> {
    await this.tokensRepository.delete(id);
  }
}
