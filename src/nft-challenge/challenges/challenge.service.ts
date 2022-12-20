import { Injectable } from '@nestjs/common';
import { Challenge } from './challenge.entity';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import {
  Repository,
  Brackets,
  Between,
  MoreThan,
  LessThan,
  Connection,
} from 'typeorm';
import { Nft } from 'src/nfts/nft.entity';
import { Token } from 'src/tokens/token.entity';
import { UpdateChallengeDTO } from './dto/update-challenge.dto';
import { User } from 'src/users/users.entity';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectRepository(Challenge)
    private challengesRepository: Repository<Challenge>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getAllChallenges(): Promise<any> {
    return this.challengesRepository.find({
      relations: ['submits', 'creator', 'nft'],
      where: {
        hidden_status: 1,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getChallenges(
    paginationDto: PaginationDto,
    filters,
    order,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const chainId = paginationDto.chainId;
    const count = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.submits', 'submit')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .where('Challenge.status = :status', { status: 1 })
      .andWhere('Challenge.hidden_status = :status', { status: 1 })
      .andWhere(
        new Brackets((query) => {
          query.where(`nft.status IS NULL`).orWhere('nft.status = 1');
        }),
      )
      .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere(
        new Brackets((query) => {
          let first = true;
          for (let key of Object.keys(filters)) {
            let obj = {};
            obj[key] = filters[key];
            if (key == 'expiresAt') {
              if (first) {
                query.where(`Challenge.${key} >= :${key}`, obj);
                first = false;
              } else {
                query.andWhere(`Challenge.${key} >= :${key}`, obj);
              }
            } else if (key == 'airdropStartAt') {
              if (first) {
                query
                  .where(`Challenge.${key} <= :${key}`, obj)
                  .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                first = false;
              } else {
                query
                  .andWhere(`Challenge.${key} <= :${key}`, obj)
                  .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
              }
            } else if (key == 'airdropEndAt') {
              if (first) {
                query.where(`Challenge.${key} <= :${key}`, obj);
                first = false;
              } else {
                query.andWhere(`Challenge.${key} <= :${key}`, obj);
              }
            }
          }
        }),
      )
      .getMany();
    const totalCount = count.length;
    let nfts;

    if (order == 'ASC') {
      nfts = await this.challengesRepository
        .createQueryBuilder('Challenge')
        .leftJoinAndSelect('Challenge.submits', 'submit')
        .leftJoinAndSelect('Challenge.creator', 'creator')
        .leftJoinAndSelect('Challenge.nft', 'nft')
        .where('Challenge.status = :status', { status: 1 })
        .andWhere('Challenge.hidden_status = :status', { status: 1 })
        .andWhere(
          new Brackets((query) => {
            query.where(`nft.status IS NULL`).orWhere('nft.status = 1');
          }),
        )
        .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let obj = {};
              obj[key] = filters[key];
              if (key == 'expiresAt') {
                if (first) {
                  query.where(`Challenge.${key} >= :${key}`, obj);
                  first = false;
                } else {
                  query.andWhere(`Challenge.${key} >= :${key}`, obj);
                }
              } else if (key == 'airdropStartAt') {
                if (first) {
                  query
                    .where(`Challenge.${key} <= :${key}`, obj)
                    .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                  first = false;
                } else {
                  query
                    .andWhere(`Challenge.${key} <= :${key}`, obj)
                    .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                }
              } else if (key == 'airdropEndAt') {
                if (first) {
                  query.where(`Challenge.${key} <= :${key}`, obj);
                  first = false;
                } else {
                  query.andWhere(`Challenge.${key} <= :${key}`, obj);
                }
              }
            }
          }),
        )
        .skip(skippedItems)
        .take(paginationDto.limit)
        .addOrderBy('Challenge.createdAt', 'ASC')
        .getMany();
    } else {
      nfts = await this.challengesRepository
        .createQueryBuilder('Challenge')
        .leftJoinAndSelect('Challenge.submits', 'submit')
        .leftJoinAndSelect('Challenge.creator', 'creator')
        .leftJoinAndSelect('Challenge.nft', 'nft')
        .where('Challenge.status = :status', { status: 1 })
        .andWhere('Challenge.hidden_status = :status', { status: 1 })
        .andWhere(
          new Brackets((query) => {
            query.where(`nft.status IS NULL`).orWhere('nft.status = 1');
          }),
        )
        .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let obj = {};
              obj[key] = filters[key];
              if (key == 'expiresAt') {
                if (first) {
                  query.where(`Challenge.${key} >= :${key}`, obj);
                  first = false;
                } else {
                  query.andWhere(`Challenge.${key} >= :${key}`, obj);
                }
              } else if (key == 'airdropStartAt') {
                if (first) {
                  query
                    .where(`Challenge.${key} <= :${key}`, obj)
                    .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                  first = false;
                } else {
                  query
                    .andWhere(`Challenge.${key} <= :${key}`, obj)
                    .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                }
              } else if (key == 'airdropEndAt') {
                if (first) {
                  query.where(`Challenge.${key} <= :${key}`, obj);
                  first = false;
                } else {
                  query.andWhere(`Challenge.${key} <= :${key}`, obj);
                }
              }
            }
          }),
        )
        .skip(skippedItems)
        .take(paginationDto.limit)
        .addOrderBy('Challenge.createdAt', 'DESC')
        .getMany();
    }

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: nfts,
    };
  }

  async getChallenge(
    creator_id: string,
    paginationDto: PaginationDto,
    filters,
    order,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const chainId = filters.chainId;
    const count = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.submits', 'submit')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .where('creator.id = :id', { id: creator_id })
      .andWhere('Challenge.hidden_status = :status', { status: 1 })
      .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere(
        new Brackets((query) => {
          let first = true;
          for (let key of Object.keys(filters)) {
            let obj = {};
            obj[key] = filters[key];
            if (key == 'expiresAt') {
              if (first) {
                query.where(`Challenge.${key} >= :${key}`, obj);
                first = false;
              } else {
                query.andWhere(`Challenge.${key} >= :${key}`, obj);
              }
            } else if (key == 'airdropStartAt') {
              if (first) {
                query
                  .where(`Challenge.${key} <= :${key}`, obj)
                  .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                first = false;
              } else {
                query
                  .andWhere(`Challenge.${key} <= :${key}`, obj)
                  .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
              }
            } else if (key == 'airdropEndAt') {
              if (first) {
                query.where(`Challenge.${key} <= :${key}`, obj);
                first = false;
              } else {
                query.andWhere(`Challenge.${key} <= :${key}`, obj);
              }
            }
          }
        }),
      )
      .getMany();
    const totalCount = count.length;
    var nfts;

    if (order == 'ASC') {
      nfts = await this.challengesRepository
        .createQueryBuilder('Challenge')
        .leftJoinAndSelect('Challenge.submits', 'submit')
        .leftJoinAndSelect('Challenge.creator', 'creator')
        .leftJoinAndSelect('Challenge.nft', 'nft')
        .where('creator.id = :id', { id: creator_id })
        .andWhere('Challenge.hidden_status = :status', { status: 1 })
        .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let obj = {};
              obj[key] = filters[key];
              if (key == 'expiresAt') {
                if (first) {
                  query.where(`Challenge.${key} >= :${key}`, obj);
                  first = false;
                } else {
                  query.andWhere(`Challenge.${key} >= :${key}`, obj);
                }
              } else if (key == 'airdropStartAt') {
                if (first) {
                  query
                    .where(`Challenge.${key} <= :${key}`, obj)
                    .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                  first = false;
                } else {
                  query
                    .andWhere(`Challenge.${key} <= :${key}`, obj)
                    .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                }
              } else if (key == 'airdropEndAt') {
                if (first) {
                  query.where(`Challenge.${key} <= :${key}`, obj);
                  first = false;
                } else {
                  query.andWhere(`Challenge.${key} <= :${key}`, obj);
                }
              }
            }
          }),
        )
        .skip(skippedItems)
        .take(paginationDto.limit)
        .addOrderBy('Challenge.createdAt', 'ASC')
        .getMany();
    } else {
      nfts = await this.challengesRepository
        .createQueryBuilder('Challenge')
        .leftJoinAndSelect('Challenge.submits', 'submit')
        .leftJoinAndSelect('Challenge.creator', 'creator')
        .leftJoinAndSelect('Challenge.nft', 'nft')
        .where('creator.id = :id', { id: creator_id })
        .andWhere('Challenge.hidden_status = :status', { status: 1 })
        .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let obj = {};
              obj[key] = filters[key];
              if (key == 'expiresAt') {
                if (first) {
                  query.where(`Challenge.${key} >= :${key}`, obj);
                  first = false;
                } else {
                  query.andWhere(`Challenge.${key} >= :${key}`, obj);
                }
              } else if (key == 'airdropStartAt') {
                if (first) {
                  query
                    .where(`Challenge.${key} <= :${key}`, obj)
                    .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                  first = false;
                } else {
                  query
                    .andWhere(`Challenge.${key} <= :${key}`, obj)
                    .andWhere(`Challenge.airdropEndAt >= :${key}`, obj);
                }
              } else if (key == 'airdropEndAt') {
                if (first) {
                  query.where(`Challenge.${key} <= :${key}`, obj);
                  first = false;
                } else {
                  query.andWhere(`Challenge.${key} <= :${key}`, obj);
                }
              }
            }
          }),
        )
        .skip(skippedItems)
        .take(paginationDto.limit)
        .addOrderBy('Challenge.createdAt', 'DESC')
        .getMany();
    }

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: nfts,
    };
  }

  getChallengeByAssetId(assetId: string): Promise<any> {
    return this.challengesRepository.findOne({
      where: { assetId: assetId },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  getChallengesByNFT(nft_id): Promise<any> {
    return this.challengesRepository.find({
      relations: ['submits', 'creator', 'nft'],
      order: {
        createdAt: 'DESC',
      },
      where: [
        {
          nft: { id: nft_id },
        },
      ],
    });
  }

  getChallengeById(id): Promise<any> {
    return this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.submits', 'submits')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .leftJoinAndSelect('Challenge.token', 'token')
      .where('Challenge.id = :id', { id: id })
      .getOne();
  }

  getSpotLightChallengeById(id): Promise<any> {
    return this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.spotlights', 'spotlight')
      .where('Challenge.id = :id', { id: id })
      .getOne();
  }

  getNumberOfChallenges(startDate: string, endDate: string): Promise<any> {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;
    let where = {};
    if (_startDate && _endDate) {
      where = {
        createdAt: Between(new Date(_startDate), new Date(_endDate)),
      };
    } else if (_startDate) {
      where = {
        createdAt: MoreThan(new Date(_startDate)),
      };
    } else if (_endDate) {
      where = {
        createdAt: LessThan(new Date(_endDate)),
      };
    }
    return this.challengesRepository.count({
      where,
    });
  }

  // async getTotalAirdropFee(): Promise<any> {
  //   const sum = await this.challengesRepository
  //     .createQueryBuilder('Challenge')
  //     .select('SUM(Challenge.airdropFee)', 'sum')
  //     .getRawOne();
  //   return sum.sum;
  // }

  addChallenge(challenge): Promise<any> {
    if (challenge.asset_type == 1) {
      const nft = new Nft();
      nft.id = challenge.nft_id;
      challenge.nft = nft;
    } else if (challenge.asset_type == 2) {
      const token = new Token();
      token.id = challenge.token_id;
      challenge.token = token;
    }
    const creator = new User();
    creator.id = challenge.creator_id;
    challenge.creator = creator;
    return this.challengesRepository.save(challenge);
  }

  updateChallenge(updateChallengeDTO: UpdateChallengeDTO): Promise<any> {
    return this.challengesRepository.update(
      updateChallengeDTO.id,
      updateChallengeDTO,
    );
  }

  updateCancel(updateChallenge): Promise<any> {
    return this.challengesRepository.update(
      updateChallenge.id,
      updateChallenge,
    );
  }

  async remove(id: string): Promise<void> {
    await this.challengesRepository.delete(id);
  }

  async getTopChallenges(limit, chainId) {
    const finelArray = [];
    const nftChallengeObj = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .leftJoinAndSelect('Challenge.submits', 'submits')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.token', 'token')
      .where('Challenge.hidden_status = :status', { status: 1 })
      .andWhere(
        new Brackets((query) => {
          query.where(`nft.status IS NULL`).orWhere('nft.status = 1');
        }),
      )
      .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere('Challenge.status = :status', { status: 1 })
      .andWhere('Challenge.expiresAt > :time', { time: new Date().getTime() })
      .orderBy('Challenge.expiresAt', 'ASC')
      .take(limit)
      .getMany();

    nftChallengeObj.forEach((obj) => {
      finelArray.push(obj);
    });
    if (finelArray.length < limit) {
      const expiredNftChallengeObj = await this.challengesRepository
        .createQueryBuilder('Challenge')
        .leftJoinAndSelect('Challenge.nft', 'nft')
        .leftJoinAndSelect('Challenge.submits', 'submits')
        .leftJoinAndSelect('Challenge.creator', 'creator')
        .leftJoinAndSelect('Challenge.token', 'token')
        .where('Challenge.hidden_status = :status', { status: 1 })
        .andWhere(
          new Brackets((query) => {
            query.where(`nft.status IS NULL`).orWhere('nft.status = 1');
          }),
        )
        .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere('Challenge.status = :status', { status: 1 })
        .andWhere('Challenge.expiresAt <= :time', {
          time: new Date().getTime(),
        })
        .orderBy('Challenge.expiresAt', 'DESC')
        .take(limit - finelArray.length)
        .getMany();

      expiredNftChallengeObj.forEach((obj) => {
        finelArray.push(obj);
      });
    }
    return finelArray;
  }

  async getSearchChallenge(
    param: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .leftJoinAndSelect('Challenge.submits', 'submits')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.token', 'token')
      .where('Challenge.name ilike :name', { name: `%${param}%` })
      .andWhere('Challenge.hidden_status = :status', { status: 1 })
      .andWhere(
        new Brackets((query) => {
          query.where(`nft.status IS NULL`).orWhere('nft.status = 1');
        }),
      )
      .getMany();
    const totalCount = count.length;

    const challenges = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .leftJoinAndSelect('Challenge.submits', 'submits')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.token', 'token')
      .where('Challenge.name ilike :name', { name: `%${param}%` })
      .andWhere('Challenge.hidden_status = :status', { status: 1 })
      .andWhere(
        new Brackets((query) => {
          query.where(`nft.status IS NULL`).orWhere('nft.status = 1');
        }),
      )
      .orderBy('Challenge.createdAt', 'DESC')
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: challenges,
    };
  }

  async getSearchChallengeByUser(
    user: string,
    param: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .leftJoinAndSelect('Challenge.submits', 'submits')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.token', 'token')
      .where('Challenge.name ilike :name', { name: `%${param}%` })
      .andWhere('Challenge.hidden_status = :status', { status: 1 })
      .andWhere('creator.address = :userAddress', { userAddress: user })
      .getMany();
    const totalCount = count.length;

    const nfts = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .leftJoinAndSelect('Challenge.submits', 'submits')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.token', 'token')
      .where('Challenge.name ilike :name', { name: `%${param}%` })
      .andWhere('Challenge.hidden_status = :status', { status: 1 })
      .andWhere('creator.address = :userAddress', { userAddress: user })
      .orderBy('Challenge.createdAt', 'DESC')
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: nfts,
    };
  }

  async getSpotlightChallenges(paginationDto: PaginationDto): Promise<any> {
    console.log('paginationDto', paginationDto);
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const chainId = Number(paginationDto.chainId);
    const count = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .leftJoinAndSelect('Challenge.spotlights', 'spotlight')
      .where('spotlight.id IS NOT NULL')
      .andWhere('Challenge.hidden_status = :status', { status: 1 })
      .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere(
        new Brackets((query) => {
          query.where(`nft.status IS NULL`).orWhere('nft.status = 1');
        }),
      )
      .getCount();
    const challenges = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .leftJoinAndSelect('Challenge.submits', 'submits')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.token', 'token')
      .leftJoinAndSelect('Challenge.spotlights', 'spotlight')
      .where('spotlight.id IS NOT NULL')
      .andWhere('Challenge.hidden_status = :status', { status: 1 })
      .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere(
        new Brackets((query) => {
          query.where(`nft.status IS NULL`).orWhere('nft.status = 1');
        }),
      )
      .orderBy({ 'spotlight.order': 'ASC' })
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();
    return {
      totalCount: count,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: challenges,
    };
  }

  getChallengeStat(startDate, endDate) {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;
    const query = `SELECT  d.ref_date :: date AS "date"
    , count(id) AS "count" FROM generate_series('${_startDate.toLocaleDateString()}' :: timestamp, '${_endDate.toLocaleDateString()}' :: timestamp, '1 day') AS d(ref_date)
    LEFT JOIN "challenge"
    ON date_trunc('day', d.ref_date) = date_trunc('day', "challenge"."createdAt")
    GROUP BY d.ref_date ORDER BY d.ref_date ASC`;
    return this.connection.query(query);
  }

  async getAdminChallenges(
    paginationDto: PaginationDto,
    order,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const chainId = Number(paginationDto.chainId);
    const count = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .where(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .getMany();
    const totalCount = count.length;
    const nfts = await this.challengesRepository
      .createQueryBuilder('Challenge')
      .leftJoinAndSelect('Challenge.submits', 'submit')
      .leftJoinAndSelect('Challenge.creator', 'creator')
      .leftJoinAndSelect('Challenge.nft', 'nft')
      .andWhere(chainId > 0 ? `Challenge.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .orderBy({ 'Challenge.createdAt': order })
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: nfts,
    };
  }
}
