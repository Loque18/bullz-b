import { HttpException, Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { Royalty } from './royalty.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoyaltysService {
  constructor(
    @InjectRepository(Royalty)
    private royaltiesRepository: Repository<Royalty>,
  ) {}

  getRoyaltys(): Promise<any> {
    return this.royaltiesRepository.find();
  }

  getRoyalty(token_id: number): Promise<any> {
    return this.royaltiesRepository
      .createQueryBuilder('Royalty')
      .where('Royalty.token_id = :token_id', { token_id: token_id })
      .getOne();
  }

  addRoyalty(royaltie): Promise<any> {
    return this.royaltiesRepository.save(royaltie);
  }

  /**
   * @dev remove holder
   * @param id
   */
  async remove(id: string): Promise<void> {
    await this.royaltiesRepository.delete(id);
  }
}
