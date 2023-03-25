import { Injectable, OnModuleInit } from '@nestjs/common';
import { Collection } from './collection.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';
import { UsersService } from '../users/users.service';
import { NftsService } from '../nfts/nft.service';
import { UpdateCollectionDTO } from './dto/update-collection.dto';
import { DefaultCollections } from './collection.default';

// import collectionData from './collection.default';
@Injectable()
export class CollectionService implements OnModuleInit {
  constructor(
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
    private UsersService: UsersService,
    private NftsService: NftsService,
    private defaultCollections: DefaultCollections,
  ) {}

  async onModuleInit() {
    const collectionCount = await this.getCollectionCount();
    console.log('collectionCount', collectionCount);
    const collections = this.defaultCollections.getCollections();
    await this.collectionRepository
      .createQueryBuilder()
      .insert()
      .into(Collection)
      .values(collections)
      .orIgnore()
      .execute();
  }

  getCollectionCount(): Promise<any> {
    return this.collectionRepository.count();
  }

  getTrending(startDate, endDate, chainId): Promise<any> {
    startDate = new Date(parseInt(startDate));
    endDate = new Date(parseInt(endDate));
    console.log(startDate, endDate);
    return this.collectionRepository
      .createQueryBuilder('Collection')
      .where('Collection.updatedAt > :startDate', {
        startDate: startDate,
      })
      .andWhere(chainId > 0 ? `Collection.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere('Collection.updatedAt < :endDate', {
        endDate: endDate,
      })
      .leftJoinAndSelect('Collection.user', 'user')
      .orderBy('Collection.totalVolume', 'DESC')
      .take(12)
      .getMany();
  }

  getCollectionsByAddress(address: string): Promise<any> {
    return this.collectionRepository
      .createQueryBuilder('Collection')
      .leftJoinAndSelect('Collection.user', 'user')
      .orWhere('LOWER(Collection.address) = LOWER(:address)', {
        address: address,
      })
      .getMany();
  }

  getCollectionsById(id: number): Promise<any> {
    return this.collectionRepository
      .createQueryBuilder('Collection')
      .where('Collection.id = :id', { id: id })
      .getOne();
  }

  async getAdminCollections(paginationDto, order): Promise<any> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const chainId = Number(paginationDto.chainId);
    const totalCount = await this.collectionRepository
      .createQueryBuilder('Collection')
      .where('Collection.user IS NULL')
      .andWhere(chainId > 0 ? `Collection.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .getCount();

    const collections = await this.collectionRepository
      .createQueryBuilder('Collection')
      .where('Collection.user IS NULL')
      .andWhere(chainId > 0 ? `Collection.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .orderBy({ 'Collection.createdAt': order })
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: collections,
    };
  }

  async getCollectionsPaginated(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.collectionRepository.count();
    const totalCount = count;
    const nfts = await this.collectionRepository
      .createQueryBuilder('Collection')
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

  async getCollectionsByTypePaginated(
    type: string,
    id: string,
    chain_id: number,
    paginationDto: PaginationDto,
  ): Promise<any> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.collectionRepository
      .createQueryBuilder('Collection')
      .where('Collection.type = :id', { id: type })
      .andWhere('Collection.chain_id = :chain_id', { chain_id: chain_id })
      .leftJoinAndSelect('Collection.user', 'user')
      .andWhere('user.id = :baseId', { baseId: id })
      .getMany();
    const totalCount = count.length;

    const nfts = await this.collectionRepository
      .createQueryBuilder('Collection')
      .where('Collection.type = :id', { id: type })
      .andWhere('Collection.chain_id = :chain_id', { chain_id: chain_id })
      .leftJoinAndSelect('Collection.user', 'user')
      .andWhere('user.id = :baseId', { baseId: id })
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();

    const admin = await this.collectionRepository
      .createQueryBuilder('Collection')
      .where('Collection.type = :id', { id: type })
      .andWhere('Collection.chain_id = :chain_id', { chain_id: chain_id })
      .andWhere('Collection.user IS NULL')
      .getOne();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: nfts,
      yaaas: admin,
    };
  }

  addCollection(collection): Promise<any> {
    return this.collectionRepository.save(collection);
  }

  async getSearch(param): Promise<any> {
    const collection = await this.collectionRepository
      .createQueryBuilder('Collection')
      .where('name ilike :name', { name: `%${param}%` })
      .orderBy('Collection.totalVolume', 'DESC')
      .take(3)
      .getMany();
    const user = await this.UsersService.getSearch(param);
    const nft = await this.NftsService.getSearch(param);

    const data = {
      collection: collection,
      user: user,
      nft: nft,
    };
    return data;
  }

  async getSearchCollection(
    param: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.collectionRepository
      .createQueryBuilder('Collection')
      .where('name ilike :name', { name: `%${param}%` })
      .getMany();
    const totalCount = count.length;

    const collections = await this.collectionRepository
      .createQueryBuilder('Collection')
      .leftJoinAndSelect('Collection.user', 'user')
      .where('name ilike :name', { name: `%${param}%` })
      .orderBy('Collection.totalVolume', 'DESC')
      .skip(skippedItems)
      .take(paginationDto.limit)
      .getMany();
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: collections,
    };
  }

  update(updateCollectionDTO: UpdateCollectionDTO): Promise<any> {
    return this.collectionRepository.update(
      updateCollectionDTO.id,
      updateCollectionDTO,
    );
  }

  async remove(id: string): Promise<void> {
    await this.collectionRepository.delete(id);
  }
}

//API not used

/*
  getCollections(type: String): Promise<any> {
    return this.collectionRepository.find({
      relations: ['user'],
      where: [{ type: type }],
    });
  }
*/
