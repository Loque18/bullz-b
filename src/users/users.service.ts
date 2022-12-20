import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import { resolve } from 'path';
import {
  Repository,
  Between,
  MoreThan,
  LessThan,
  Connection,
  Brackets,
} from 'typeorm';
import { User } from './users.entity';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';
import { USERS } from './mocks/users.mock';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  getUsers(): Promise<any> {
    return (
      this.usersRepository
        .createQueryBuilder('User')
        .leftJoinAndSelect('User.likes', 'like')
        // .leftJoinAndSelect('User.challenges', 'challenges')
        .loadRelationCountAndMap('User.challengeCreated', 'User.challenges')
        // .leftJoinAndSelect('User.submits', 'submits')
        .loadRelationCountAndMap('User.challengeSubmitted', 'User.submits')
        .getMany()
    );
  }

  getTopCreators(startDate, endDate): Promise<any> {
    startDate = new Date(parseInt(startDate));
    endDate = new Date(parseInt(endDate));
    return this.usersRepository
      .createQueryBuilder('User')
      .where('User.totalSold > :value', {
        value: process.env.MINIMUM_SALE_VALUE,
      })
      .andWhere('User.updatedAt > :startDate', {
        startDate: startDate,
      })
      .andWhere('User.updatedAt < :endDate', {
        endDate: endDate,
      })
      .leftJoinAndSelect('User.likes', 'like')
      .orderBy('User.totalSold', 'DESC')
      .take(12)
      .getMany();
  }

  async getAllCreators(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.usersRepository
      .createQueryBuilder('User')
      // .where('User.totalSold > :value', {
      //   value: process.env.MINIMUM_SALE_VALUE,
      // })
      .getMany();
    const totalCount = count.length;

    const users = await this.usersRepository
      .createQueryBuilder('User')
      // .where('User.totalSold > :value', {
      //   value: process.env.MINIMUM_SALE_VALUE,
      // })
      .leftJoinAndSelect('User.likes', 'like')
      .orderBy('User.totalSold', 'DESC')
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: users,
    };
  }

  getTopBuyers(): Promise<any> {
    return this.usersRepository
      .createQueryBuilder('User')
      .leftJoinAndSelect('User.likes', 'like')
      .where('User.totalBought > :value', {
        value: process.env.MINIMUM_SALE_VALUE,
      })
      .orderBy('User.totalBought', 'DESC')
      .take(12)
      .getMany();
  }

  async getAllBuyers(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.totalBought > :value', {
        value: process.env.MINIMUM_SALE_VALUE,
      })
      .getMany();
    const totalCount = count.length;

    const users = await this.usersRepository
      .createQueryBuilder('User')
      .leftJoinAndSelect('User.likes', 'like')
      .where('User.totalBought > :value', {
        value: process.env.MINIMUM_SALE_VALUE,
      })
      .orderBy('User.totalBought', 'DESC')
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: users,
    };
  }

  getUser(address: string): Promise<any> {
    return this.usersRepository
      .createQueryBuilder('User')
      .leftJoinAndSelect('User.likes', 'like')
      .loadRelationCountAndMap('User.challengeCreated', 'User.challenges')
      .loadRelationCountAndMap('User.challengeSubmitted', 'User.submits')
      .where('LOWER(User.address) = LOWER(:address)', { address: address })
      .getOne();
    // return this.usersRepository.findOne({});
  }

  async follow(id: string, id2: string): Promise<any> {
    const userDetail = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.id = :id', { id: id })
      .getOne();
    const userDetail2 = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.id = :id', { id: id2 })
      .getOne();
    var count1 = 0;
    var index1 = 0;
    var count2 = 0;
    var index2 = 0;
    for (let i = 0; i < userDetail.following.length; i++) {
      if (userDetail.following[i] == id2) {
        count1++;
        index1 = i;
        break;
      }
    }
    for (let i = 0; i < userDetail2.follower.length; i++) {
      if (userDetail2.follower[i] == id) {
        count2++;
        index2 = i;
      }
    }
    if (count1 > 0) {
      userDetail.following.splice(index1);
    } else {
      userDetail.following.push(id2);
    }
    if (count2 > 0) {
      userDetail2.follower.splice(index2);
    } else {
      userDetail2.follower.push(id);
    }
    await this.usersRepository.save(userDetail);
    await this.usersRepository.save(userDetail2);
    return 'Followed/Unfollowed Successfully';
  }

  async checkFollow(id: string, id2: string): Promise<any> {
    const userDetail = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.id = :id', { id: id })
      .getOne();
    var count1 = 0;
    var index1 = 0;

    for (let i = 0; i < userDetail.following.length; i++) {
      if (userDetail.following[i] == id2) {
        count1++;
        index1 = i;
        break;
      }
    }

    if (count1 > 0) return true;
    else return false;
  }
  async getFollower(id: string): Promise<any> {
    const userDetail = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.id = :id', { id: id })
      .getOne();
    var arr = [];
    for (let i = 0; i < userDetail.follower.length; i++) {
      var userDetailArr = await this.usersRepository
        .createQueryBuilder('User')
        .where('User.id = :id', { id: userDetail.follower[i] })
        .getOne();
      arr.push(userDetailArr);
    }
    return arr;
  }

  async getFollowing(id: string): Promise<any> {
    const userDetail = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.id = :id', { id: id })
      .getOne();
    var arr = [];
    for (let i = 0; i < userDetail.following.length; i++) {
      var userDetailArr = await this.usersRepository
        .createQueryBuilder('User')
        .where('User.id = :id', { id: userDetail.following[i] })
        .getOne();
      arr.push(userDetailArr);
    }
    return arr;
  }
  getUserById(id: number): Promise<any> {
    return this.usersRepository
      .createQueryBuilder('User')
      .leftJoinAndSelect('User.likes', 'like')
      .where('User.id = :id', { id: id })
      .getOne();
    // return this.usersRepository.findOne({});
  }

  addUser(user): Promise<any> {
    return this.usersRepository.save(user);
  }
  updateUser(updateUserDTO: UpdateUserDTO): Promise<any> {
    return this.usersRepository.update(updateUserDTO.id, updateUserDTO);
  }

  /**
   * @dev remove holder
   * @param id
   */
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  /**
   * @dev remove holder
   * @param id
   */
  async find(id: string): Promise<any> {
    return this.usersRepository
      .createQueryBuilder('User')
      .leftJoinAndSelect('User.likes', 'like')
      .where('User.id = :id', { id: id })
      .getOne();
  }

  async getSearch(param): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('User')
      .where('firstname ilike :name', { name: `%${param}%` })
      .orWhere('lastname ilike :name', { name: `%${param}%` })
      .orWhere('username ilike :name', { name: `%${param}%` })
      .orderBy('User.totalSold', 'DESC')
      .take(3)
      .getMany();
    return user;
  }

  async getSearchUser(
    param: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.usersRepository
      .createQueryBuilder('User')
      .where('firstname ilike :name', { name: `%${param}%` })
      .orWhere('lastname ilike :name', { name: `%${param}%` })
      .orWhere('username ilike :name', { name: `%${param}%` })
      .getMany();
    const totalCount = count.length;

    const users = await this.usersRepository
      .createQueryBuilder('User')
      .where('firstname ilike :name', { name: `%${param}%` })
      .orWhere('lastname ilike :name', { name: `%${param}%` })
      .orWhere('username ilike :name', { name: `%${param}%` })
      .orderBy('User.totalSold', 'DESC')
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: users,
    };
  }

  async getUserByName(username: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('User')
      .where('LOWER(username) = LOWER(:name)', { name: username })
      .getOne();
    return user;
  }

  async getNumberOfUsers(
    startDate: string,
    endDate: string,
    selectedSocials: string,
  ): Promise<any> {
    // console.log('selectedSocials', selectedSocials);
    let socials = [];
    if (selectedSocials && selectedSocials.length) {
      socials = selectedSocials.split(',');
    }
    // console.log('socials', socials);
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;
    // let where = {};
    // if (_startDate && _endDate) {
    //   where = {
    //     createdAt: Between(new Date(_startDate), new Date(_endDate)),
    //   };
    // } else if (_startDate) {
    //   where = {
    //     createdAt: MoreThan(new Date(_startDate)),
    //   };
    // } else if (_endDate) {
    //   where = {
    //     createdAt: LessThan(new Date(_endDate)),
    //   };
    // }
    // return this.usersRepository.count({
    //   where,
    // });
    const count = await this.usersRepository
      .createQueryBuilder('User')
      .where(_startDate ? `User.createdAt > :start_date` : '1=1', {
        start_date: _startDate,
      })
      .andWhere(_endDate ? `User.createdAt < :end_date` : '1=1', {
        end_date: _endDate,
      })
      .andWhere(
        new Brackets((query) => {
          let isFirst = true;
          socials.forEach((social) => {
            if (social == 'twitter') {
              if (isFirst) {
                isFirst = false;
                query.where('User.twitter_url != :twitter_url', {
                  twitter_url: 'https://twitter.com/',
                });
              } else {
                query.andWhere('User.twitter_url != :twitter_url', {
                  twitter_url: 'https://twitter.com/',
                });
              }
            } else if (social == 'instagram') {
              if (isFirst) {
                isFirst = false;
                query.where('User.instagram_url != :instagram_url', {
                  instagram_url: 'https://www.instagram.com/',
                });
              } else {
                query.andWhere('User.instagram_url != :instagram_url', {
                  instagram_url: 'https://www.instagram.com/',
                });
              }
            } else if (social == 'youtube') {
              if (isFirst) {
                isFirst = false;
                query.where('User.youtube_url != :youtube_url', {
                  youtube_url: 'https://www.youtube.com/',
                });
              } else {
                query.andWhere('User.youtube_url != :youtube_url', {
                  youtube_url: 'https://www.youtube.com/',
                });
              }
            } else if (social == 'twitch') {
              if (isFirst) {
                isFirst = false;
                query.where('User.twitch_url != :twitch_url', {
                  twitch_url: 'https://twitch.tv/',
                });
              } else {
                query.andWhere('User.twitch_url != :twitch_url', {
                  twitch_url: 'https://twitch.tv/',
                });
              }
            } else if (social == 'tiktok') {
              if (isFirst) {
                isFirst = false;
                query.where('User.tiktok_url != :tiktok_url', {
                  tiktok_url: 'https://www.tiktok.com/',
                });
              } else {
                query.andWhere('User.tiktok_url != :tiktok_url', {
                  tiktok_url: 'https://www.tiktok.com/',
                });
              }
            }
          });
        }),
      )
      .getCount();
    return count;
  }

  getUserStat(startDate, endDate) {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;
    // let where = '';
    // if (_startDate && _endDate) {
    //   where = `where "user"."createdAt" >= '${_startDate.toLocaleDateString()}' and "user"."createdAt" < '${_endDate.toLocaleDateString()}'`;
    // } else if (_startDate) {
    //   where = `where "user"."createdAt" > '${_startDate.toLocaleDateString()}'`;
    // } else if (_endDate) {
    //   where = `where "user"."createdAt" < '${_endDate.toLocaleDateString()}'`;
    // }
    // const query = `SELECT DATE_TRUNC('day',
    // "user"."createdAt") AS date,
    // COUNT(ID) AS COUNT
    // FROM "user"
    // ${where}
    // GROUP BY date
    // ORDER BY date ASC`;
    // console.log('query', query);

    const query = `SELECT  d.ref_date :: date AS "date"
    , count(id) AS "count" FROM generate_series('${_startDate.toLocaleDateString()}' :: timestamp, '${_endDate.toLocaleDateString()}' :: timestamp, '1 day') AS d(ref_date)
    LEFT JOIN "user"
    ON date_trunc('day', d.ref_date) = date_trunc('day', "user"."createdAt")
    GROUP BY d.ref_date ORDER BY d.ref_date ASC`;

    console.log('query', query);
    return this.connection.query(query);
  }

  async getAdminUsers(paginationDto, order): Promise<any> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const totalCount = await this.usersRepository
      .createQueryBuilder('User')
      .getCount();

    const users = await this.usersRepository
      .createQueryBuilder('User')
      .leftJoinAndSelect('User.likes', 'like')
      .loadRelationCountAndMap('User.challengeCreated', 'User.challenges')
      .loadRelationCountAndMap('User.challengeSubmitted', 'User.submits')
      .orderBy({ 'User.createdAt': order })
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: users,
    };
  }
}
