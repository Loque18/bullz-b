import { Injectable } from '@nestjs/common';
import { Submit } from './submit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { UpdateSubmitDTO } from './dto/update-submit.dto';
import { CreateSubmitDTO } from './dto/create-submit.dto';

import { Challenge } from '../challenges/challenge.entity';
import { User } from 'src/users/users.entity';

import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';

@Injectable()
export class SubmitsService {
  constructor(
    @InjectRepository(Submit)
    private submitsRepository: Repository<Submit>,
  ) {}

  getSubmits(): Promise<any> {
    return this.submitsRepository.find({
      relations: ['challenge', 'user'],
      order: {
        id: 'DESC',
      },
    });
  }

  async getSubmitsByChallenge(
    challenge_id,
    paginationDto: PaginationDto,
    filters,
    order,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const count = await this.submitsRepository
      .createQueryBuilder('Submit')
      .leftJoin('Submit.challenge', 'challenge')
      .leftJoinAndSelect('Submit.user', 'user')
      .where('challenge.id = :id', { id: challenge_id })
      .andWhere(filters)
      .getMany();

    const totalCount = count.length;
    var nfts;

    if (order == 'ASC') {
      nfts = await this.submitsRepository
        .createQueryBuilder('Submit')
        .leftJoin('Submit.challenge', 'challenge')
        .leftJoinAndSelect('Submit.user', 'user')
        .where('challenge.id = :id', { id: challenge_id })
        .andWhere(filters)
        .skip(skippedItems)
        .take(paginationDto.limit)
        .addOrderBy('Submit.createdAt', 'ASC')
        .getMany();
    } else {
      nfts = await this.submitsRepository
        .createQueryBuilder('Submit')
        .leftJoin('Submit.challenge', 'challenge')
        .leftJoinAndSelect('Submit.user', 'user')
        .where('challenge.id = :id', { id: challenge_id })
        .andWhere(filters)
        .skip(skippedItems)
        .take(paginationDto.limit)
        .addOrderBy('Submit.createdAt', 'DESC')
        .getMany();
    }

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: nfts,
    };
  }
  getbyUserAndNFT(user_id, nft_id): Promise<any> {
    console.log(nft_id);
    return this.submitsRepository
      .createQueryBuilder('Submit')
      .leftJoin('Submit.challenge', 'challenge')
      .leftJoin('Submit.user', 'user')
      .leftJoin('challenge.nft', 'nft')
      .where('user.id = :id', { id: user_id })
      .andWhere(
        new Brackets((query) => {
          query.where('nft.id = :nf_id', { nf_id: nft_id });
        }),
      )
      .getOne();
  }

  getbyUserAndChallenge(submit: any): Promise<any> {
    return this.submitsRepository
      .createQueryBuilder('Submit')
      .leftJoin('Submit.challenge', 'challenge')
      .leftJoin('Submit.user', 'user')
      .where('user.id = :id', { id: submit.user_id })
      .andWhere('challenge.id = :challenge', { challenge: submit.challenge_id })
      .getOne();
  }

  updateSubmit(updateSubmitDTO: UpdateSubmitDTO): Promise<any> {
    return this.submitsRepository.update(updateSubmitDTO.id, updateSubmitDTO);
  }
  addSubmit(submit: any): Promise<any> {
    let challenge = new Challenge();
    challenge.id = submit.challenge_id;
    submit.challenge = challenge;

    let user = new User();
    user.id = submit.user_id;
    submit.user = user;

    return this.submitsRepository.save(submit);
  }

  async remove(id: string): Promise<void> {
    await this.submitsRepository.delete(id);
  }
}
