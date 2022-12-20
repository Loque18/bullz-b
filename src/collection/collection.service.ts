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

    if (collectionCount == 0) {
      const collections = this.defaultCollections.getCollections();
      for (let i = 0; i < collections.length; i++) {
        try {
          const collection = await this.addCollection(collections[i]);
          console.log('single', collection);
        } catch (e) {
          console.log(e);
        }
      }
      // const collection1 = {
      //   address: process.env.ADMIN_COLLECTION_ERC1155.toLowerCase(),
      //   coverImageType: 'image/png',
      //   image:
      //     'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
      //   name: 'BULLZ Collection',
      //   symbol: 'BULLZ',
      //   type: 'single',
      // };
      // const collection2 = {
      //   address: process.env.ADMIN_COLLECTION_ERC1155.toLowerCase(),
      //   coverImageType: 'image/png',
      //   image:
      //     'https://yaaas-test.s3-us-east-2.amazonaws.com/1656680571719logo_black.png',
      //   name: 'BULLZ Collection',
      //   symbol: 'BULLZ',
      //   type: 'multiple',
      // };

      // try {
      //   const single = await this.addCollection(collection1);
      //   console.log('single', single);
      //   const multiple = await this.addCollection(collection2);
      //   console.log('multiple', multiple);
      // } catch (e) {
      //   console.log(e);
      // }
    }
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

    var count = await this.collectionRepository.count();
    var totalCount = count;
    var nfts = await this.collectionRepository
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
  // addCollection(body,data): Promise<any> {
  //     body.image = data;
  //     return this.collectionRepository.save(body);
  // }
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
