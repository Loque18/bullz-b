import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { resolve } from 'path';

import { Brackets, In, Repository } from 'typeorm';

import { exists } from 'fs';

import { UsersService } from '../users/users.service';

import { Nft } from './nft.entity';

import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResultDto } from './dto/result.dto';
import { UpdateNftDTO } from './dto/update-nft.dto';
import { ERC721Metadata, ERC721Property, ERC721Properties } from './metadata/erc721.metadata';
import { ERC1155Metadata } from './metadata/erc1155.metadata';
import { SpotlightsService } from 'src/spotlight/spotlight.service';
@Injectable()
export class NftsService {
  private logger = new Logger(NftsService.name);
  constructor(
    @InjectRepository(Nft)
    private nftsRepository: Repository<Nft>,
    private UsersService: UsersService,
    private spotlightService: SpotlightsService,
  ) {}

  getNfts(): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .getMany();
  }

  getTrendingNfts(chainId): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .where('Nft.nftType != :nftType', { nftType: 'nft_challenge' })
      .andWhere('Nft.status = 1')
      .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere('offer.isForSell = :value', { value: true })
      .orderBy('Nft.totalTradingAmount', 'DESC')
      .take(10)
      .getMany();
  }

  getLiveAuctions(): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .where('offer.isForAuction = :id', { id: true })
      .andWhere('offer.expiresAt >= :date', { date: Date.now() })
      .orderBy('bid.price', 'ASC')
      .take(10)
      .getMany();
  }

  update(updateNftDTO: UpdateNftDTO): Promise<any> {
    return this.nftsRepository.update(updateNftDTO.id, updateNftDTO);
  }

  async likeNft(nftId, action): Promise<any> {
    const likeCount = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .where('Nft.id = :id', { id: nftId })
      .getOne();
    const newLikesCount =
      action === 'add'
        ? likeCount.likes + 1
        : action === 'sub'
        ? likeCount.likes - 1
        : 0;
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .update('Nft')
      .set({ likes: newLikesCount })
      .where('Nft.id = :id', { id: nftId })
      .returning('*')
      .execute();
  }

  async getNft(id): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .leftJoinAndSelect('challenge.creator', 'creator')
      .leftJoinAndSelect('challenge.submits', 'submit')
      // .leftJoinAndSelect('Nft.comments', 'comments')
      .where('Nft.id = :id', { id: id })
      .orderBy('offer.isForSell', 'DESC')
      .getMany();
  }

  async getNftById(id): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .leftJoinAndSelect('Nft.offers', 'offers')
      // .leftJoinAndSelect('Nft.comments', 'comments')
      .leftJoinAndSelect('challenge.creator', 'creator')
      .where('Nft.id = :id', { id: id })
      .getOne();
  }

  async getByHolderAndAsssetId(holder: string, assetId: number): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.assetId = :assetId', { assetId: assetId })
      .andWhere('Nft.holder = :holder', { holder: holder })
      .getOne();
  }

  parseAssetToId(assetId: string) {
    assetId = assetId.toString().split('.')[0];
    let parsedAssetId = parseInt(assetId, 10);
    this.logger.log('parsedAssetId: ', parsedAssetId);
    return parsedAssetId;
  }
  async getMetadata(assetId:string):Promise<ERC721Metadata | ERC1155Metadata> {
    
    this.logger.log('assetId: ', assetId);
    const parsedInt = (typeof assetId ==='string') ? this.parseAssetToId(assetId): parseInt(assetId, 10);
    
    const nft =  await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.assetId = :assetId', { assetId: parsedInt })
      .getOne();

    if(nft){
      if(nft.contractType === 'ERC721'){
        let erc721Properties = new ERC721Properties()
        erc721Properties.name = <ERC721Property>{
          type: 'string',
          descrption:nft.name
        }
        erc721Properties.description = <ERC721Property>{
          type: 'string',
          descrption:nft.description
        }
        erc721Properties.image = <ERC721Property>{
          type: 'string',
          descrption:nft.file
        }

        let erc721Metadata = new ERC721Metadata()
        erc721Metadata.title = nft.name;
        erc721Metadata.type = nft.collectionType;
        erc721Metadata.properties = erc721Properties;

        return erc721Metadata;
      }else if(nft.contractType === 'ERC1155'){
          let erc1155Matadata = new ERC1155Metadata();
          erc1155Matadata.name = nft.name;
          erc1155Matadata.description = nft.description;
          erc1155Matadata.image = nft.file;
          erc1155Matadata.external_url = process.env.FRONTEND_URL + '/art/' + nft.id;
          
          return erc1155Matadata;
      }
    }else{
      throw new NotFoundException('NFT Not found');
    }
    
  }
  async getNftAssetId(id): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .where('Nft.assetId = :id', { id: id })
      .getMany();
  }

  async getChallengeNftAssetId(asset_id): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.assetId = :asset_id', { asset_id: asset_id })
      .andWhere('Nft.nftType = :nft_type', { nft_type: 'nft_challenge' })
      .getOne();
  }

  getNftsbyOwner(holder: string): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .where('Nft.holder = :holder', { holder: holder })
      .getMany();
  }

  getNftsCountByOwner(holder: string): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.holder = :holder', { holder: holder })
      .getCount();
  }

  async getNftsByOwnerSale(
    paginationDto: PaginationDto,
    sortBy,
    filters,
    isAdmin = false,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const chainId = filters.chain_id;
    let count;
    let totalCount;
    if (sortBy == 'priceLowToHigh' || sortBy == 'priceHighToLow') {
      count = await this.nftsRepository
        .createQueryBuilder('Nft')
        .leftJoinAndSelect('Nft.offers', 'offer')
        .leftJoinAndSelect('offer.bids', 'bid')
        .where('offer.id IS NOT NULL')
        .andWhere('Nft.supply > 0')
        .andWhere(!isAdmin ? 'Nft.status = 1' : '1=1')
        .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              if (
                key == 'holder' ||
                key == 'nftType' ||
                key == 'collectionType' ||
                key == 'creator'
              ) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (first) {
                  query.where(`Nft.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                }
              }
            }
          }),
        )
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let filterAttribute = {};
              filterAttribute[key] = filters[key];
              if (
                key == 'isForSell' ||
                key == 'isForAuction' ||
                key == 'currency'
              ) {
                if (first) {
                  query.where(`offer.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                }
              } else if (key == 'price') {
                const myArr = filters[key].split('-');
                if (first) {
                  query.where(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                  first = false;
                } else {
                  query.andWhere(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                }
              }
            }
          }),
        )
        .getMany();
      totalCount = count.length;
    } else if (sortBy == 'auctionEND') {
      let date = new Date();
      let time = date.getTime();
      count = await this.nftsRepository
        .createQueryBuilder('Nft')
        .leftJoinAndSelect('Nft.offers', 'offer')
        .leftJoinAndSelect('offer.bids', 'bid')
        .where('offer.id IS NOT NULL')
        .andWhere('Nft.supply > 0')
        .andWhere(!isAdmin ? 'Nft.status = 1' : '1=1')
        .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere('offer.expiresAt >= :date', { date: time })
        .andWhere('offer.isForAuction = :auction', { auction: true })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              if (
                key == 'holder' ||
                key == 'nftType' ||
                key == 'collectionType' ||
                key == 'creator'
              ) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (first) {
                  query.where(`Nft.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                }
              }
            }
          }),
        )
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let filterAttribute = {};
              filterAttribute[key] = filters[key];
              if (
                key == 'isForSell' ||
                key == 'isForAuction' ||
                key == 'currency'
              ) {
                if (first) {
                  query.where(`offer.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                }
              } else if (key == 'price') {
                const myArr = filters[key].split('-');
                if (first) {
                  query.where(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                  first = false;
                } else {
                  query.andWhere(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                }
              }
            }
          }),
        )
        .getMany();
      totalCount = count.length;
    } else {
      count = await this.nftsRepository
        .createQueryBuilder('Nft')
        .leftJoinAndSelect('Nft.offers', 'offer')
        .leftJoinAndSelect('offer.bids', 'bid')
        .where('Nft.supply > 0')
        .andWhere(!isAdmin ? 'Nft.status = 1' : '1=1')
        .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              if (
                key == 'holder' ||
                key == 'nftType' ||
                key == 'collectionType' ||
                key == 'creator'
              ) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (first) {
                  query.where(`Nft.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                }
              }
            }
          }),
        )
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let filterAttribute = {};
              filterAttribute[key] = filters[key];
              if (
                key == 'isForSell' ||
                key == 'isForAuction' ||
                key == 'currency'
              ) {
                if (first) {
                  query.where(`offer.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                }
              } else if (key == 'price') {
                const myArr = filters[key].split('-');
                if (first) {
                  query.where(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                  first = false;
                } else {
                  query.andWhere(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                }
              }
            }
          }),
        )
        .getMany();
      totalCount = count.length;
    }

    var nfts;
    if (sortBy == 'all') {
      nfts = await this.nftsRepository
        .createQueryBuilder('Nft')
        .leftJoinAndSelect('Nft.offers', 'offer')
        .leftJoinAndSelect('offer.bids', 'bid')
        .where('Nft.supply > 0')
        .andWhere(!isAdmin ? 'Nft.status = 1' : '1=1')
        .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              if (
                key == 'holder' ||
                key == 'nftType' ||
                key == 'collectionType' ||
                key == 'creator'
              ) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (first) {
                  query.where(`Nft.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                }
              }
            }
          }),
        )
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let filterAttribute = {};
              filterAttribute[key] = filters[key];
              if (
                key == 'isForSell' ||
                key == 'isForAuction' ||
                key == 'currency'
              ) {
                if (first) {
                  query.where(`offer.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                }
              } else if (key == 'price') {
                const myArr = filters[key].split('-');
                if (first) {
                  query.where(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                  first = false;
                } else {
                  query.andWhere(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                }
              }
            }
          }),
        )
        .skip(skippedItems)
        .take(paginationDto.limit)
        .getMany();
    } else if (sortBy == 'recent') {
      nfts = await this.nftsRepository
        .createQueryBuilder('Nft')
        .leftJoinAndSelect('Nft.offers', 'offer')
        .leftJoinAndSelect('offer.bids', 'bid')
        .where('Nft.supply > 0')
        .andWhere(!isAdmin ? 'Nft.status = 1' : '1=1')
        .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              if (
                key == 'holder' ||
                key == 'nftType' ||
                key == 'collectionType' ||
                key == 'creator'
              ) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (first) {
                  query.where(`Nft.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                }
              }
            }
          }),
        )
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let filterAttribute = {};
              filterAttribute[key] = filters[key];
              if (
                key == 'isForSell' ||
                key == 'isForAuction' ||
                key == 'currency'
              ) {
                if (first) {
                  query.where(`offer.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                }
              } else if (key == 'price') {
                const myArr = filters[key].split('-');
                if (first) {
                  query.where(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                  first = false;
                } else {
                  query.andWhere(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                }
              }
            }
          }),
        )
        .addOrderBy('Nft.createdAt', 'DESC')
        .skip(skippedItems)
        .take(paginationDto.limit)
        .getMany();
    } else if (sortBy == 'priceLowToHigh' || sortBy == 'priceHighToLow') {
      nfts = await this.nftsRepository
        .createQueryBuilder('Nft')
        .leftJoinAndSelect('Nft.offers', 'offer')
        .leftJoinAndSelect('offer.bids', 'bid')
        .where('offer.id IS NOT NULL')
        .andWhere('Nft.supply > 0')
        .andWhere(!isAdmin ? 'Nft.status = 1' : '1=1')
        .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              if (
                key == 'holder' ||
                key == 'nftType' ||
                key == 'collectionType' ||
                key == 'creator'
              ) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (first) {
                  query.where(`Nft.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                }
              }
            }
          }),
        )
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let filterAttribute = {};
              filterAttribute[key] = filters[key];
              if (
                key == 'isForSell' ||
                key == 'isForAuction' ||
                key == 'currency'
              ) {
                if (first) {
                  query.where(`offer.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                }
              } else if (key == 'price') {
                const myArr = filters[key].split('-');
                if (first) {
                  query.where(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                  first = false;
                } else {
                  query.andWhere(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                }
              }
            }
          }),
        )
        .addOrderBy('offer.price', sortBy == 'priceLowToHigh' ? 'ASC' : 'DESC')
        .skip(skippedItems)
        .take(paginationDto.limit)
        .getMany();
    } else if (sortBy == 'auctionEND') {
      let date = new Date();
      let time = date.getTime();
      nfts = await this.nftsRepository
        .createQueryBuilder('Nft')
        .leftJoinAndSelect('Nft.offers', 'offer')
        .leftJoinAndSelect('offer.bids', 'bid')
        .where('offer.id IS NOT NULL')
        .andWhere('Nft.supply > 0')
        .andWhere(!isAdmin ? 'Nft.status = 1' : '1=1')
        .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere('offer.expiresAt >= :date', { date: time })
        .andWhere('offer.isForAuction = :auction', { auction: true })
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              if (
                key == 'holder' ||
                key == 'nftType' ||
                key == 'collectionType' ||
                key == 'creator'
              ) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (first) {
                  query.where(`Nft.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                }
              }
            }
          }),
        )
        .andWhere(
          new Brackets((query) => {
            let first = true;
            for (let key of Object.keys(filters)) {
              let filterAttribute = {};
              filterAttribute[key] = filters[key];
              if (
                key == 'isForSell' ||
                key == 'isForAuction' ||
                key == 'currency'
              ) {
                if (first) {
                  query.where(`offer.${key} = :${key}`, filterAttribute);
                  first = false;
                } else {
                  query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                }
              } else if (key == 'price') {
                const myArr = filters[key].split('-');
                if (first) {
                  query.where(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                  first = false;
                } else {
                  query.andWhere(`offer.price <= :maxPrice`, {
                    maxPrice: parseFloat(myArr[1]),
                  });
                  query.andWhere(`offer.price >= :minPrice`, {
                    minPrice: parseFloat(myArr[0]),
                  });
                }
              }
            }
          }),
        )
        .addOrderBy('offer.expiresAt', 'ASC')
        .skip(skippedItems)
        .take(paginationDto.limit)
        .getMany();
    }
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: nfts,
    };
  }

  addNft(nft): Promise<any> {
    return this.nftsRepository.save(nft);
  }

  async remove(id: string): Promise<void> {
    await this.nftsRepository.delete(id);
  }
  async getNftsByArtwork(): Promise<any> {
    const artObj = await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.nftType = :id', { id: 'art' })
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .take(7)
      .getMany();
    const tiktokDuetObj = await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.nftType = :id', { id: 'tiktok_duet' })
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .take(7)
      .getMany();
    const tiktokCollabObj = await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.nftType = :id', { id: 'tiktok_collab' })
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .take(7)
      .getMany();
    const musicPromoObj = await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.nftType = :id', { id: 'music_promo' })
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .take(7)
      .getMany();
    const nftChallengeObj = await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.nftType = :id', { id: 'nft_challenge' })
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .take(7)
      .getMany();
    const eventTicketObj = await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.nftType = :id', { id: 'event_tickets' })
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .take(7)
      .getMany();
    const merchandiseObj = await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.nftType = :id', { id: 'merchandise' })
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .take(7)
      .getMany();
    const exclusiveContentObj = await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.nftType = :id', { id: 'exclusive_content' })
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .take(7)
      .getMany();
    const art = artObj;
    const tiktok_duet = tiktokDuetObj;
    const tiktok_collab = tiktokCollabObj;
    const music_promo = musicPromoObj;
    const nft_challenge = nftChallengeObj;
    const event_tickets = eventTicketObj;
    const merchandise = merchandiseObj;
    const exclusive_content = exclusiveContentObj;
    return {
      art,
      tiktok_duet,
      tiktok_collab,
      music_promo,
      nft_challenge,
      event_tickets,
      merchandise,
      exclusive_content,
    };
  }

  async getTopChallenges(limit, chainId) {
    const finelArray = [];
    const nftChallengeObj = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .leftJoinAndSelect('challenge.submits', 'submit')
      .loadRelationCountAndMap('challenge.submitCount', 'challenge.submits')
      .where('Nft.nftType = :type', { type: 'nft_challenge' })
      .andWhere('Nft.status = 1')
      .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere('challenge.status = :status', { status: 1 })
      .andWhere('challenge.expiresAt > :time', { time: new Date().getTime() })
      .orderBy('challenge.expiresAt', 'ASC')
      .take(limit)
      .getMany();

    nftChallengeObj.forEach((obj) => {
      finelArray.push(obj);
    });
    if (finelArray.length < limit) {
      const expiredNftChallengeObj = await this.nftsRepository
        .createQueryBuilder('Nft')
        .leftJoinAndSelect('Nft.challenges', 'challenge')
        .leftJoinAndSelect('Nft.offers', 'offer')
        .leftJoinAndSelect('offer.bids', 'bid')
        .leftJoinAndSelect('challenge.submits', 'submit')
        .loadRelationCountAndMap('challenge.submitCount', 'challenge.submits')
        .where('Nft.nftType = :type', { type: 'nft_challenge' })
        .andWhere('Nft.status = 1')
        .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
          chain_id: chainId,
        })
        .andWhere('challenge.status = :status', { status: 1 })
        .andWhere('challenge.expiresAt <= :time', {
          time: new Date().getTime(),
        })
        .orderBy('challenge.expiresAt', 'DESC')
        .take(limit - finelArray.length)
        .getMany();

      expiredNftChallengeObj.forEach((obj) => {
        finelArray.push(obj);
      });
    }
    return finelArray;
  }

  async getCount(address): Promise<any> {
    var countViews = 0;
    var countLikes = 0;
    var user = await this.UsersService.getUser(address);
    const countFollower = user.follower.length;
    const nfts = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .where('Nft.holder = :id', { id: address })
      .getMany();
    for (let i = 0; i < nfts.length; i++) {
      countViews += nfts[i].views;
      countLikes += nfts[i].likes;
    }
    return {
      countLikes: countLikes,
      countViews: countViews,
      countFollower: countFollower,
    };
  }
  async getAllCount(): Promise<number> {

    return await this.nftsRepository
      .createQueryBuilder('Nft')
      .getCount()
  }

  async increaseView(id: string): Promise<void> {
    var result = await this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.id = :id', { id: id })
      .getOne();
    result.views++;
    await this.nftsRepository.save(result);
  }

  async getSearch(param): Promise<any> {
    const nft = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .where(
        new Brackets((query) => {
          query
            .where('Nft.name ilike :name', { name: `%${param}%` })
            .orWhere('challenge.name ilike :name', { name: `%${param}%` });
        }),
      )
      .orderBy('Nft.totalTradingAmount', 'DESC')
      .take(3)
      .getMany();
    return nft;
  }

  async getSearchNft(
    param: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .where(
        new Brackets((query) => {
          query
            .where('Nft.name ilike :name', { name: `%${param}%` })
            .orWhere('challenge.name ilike :name', { name: `%${param}%` });
        }),
      )
      .andWhere('Nft.status = 1')
      .getMany();
    const totalCount = count.length;

    const nfts = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .where(
        new Brackets((query) => {
          query
            .where('Nft.name ilike :name', { name: `%${param}%` })
            .orWhere('challenge.name ilike :name', { name: `%${param}%` });
        }),
      )
      .andWhere('Nft.status = 1')
      .orderBy('Nft.totalTradingAmount', 'DESC')
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

  async getSearchNftByCollection(
    collection: string,
    param: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;

    const count = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .where(
        new Brackets((query) => {
          query
            .where('Nft.name ilike :name', { name: `%${param}%` })
            .orWhere('challenge.name ilike :name', { name: `%${param}%` });
        }),
      )
      .andWhere('Nft.status = 1')
      .andWhere('Nft.collectionType = :collectionType', {
        collectionType: collection,
      })
      .getMany();
    const totalCount = count.length;

    const nfts = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .where(
        new Brackets((query) => {
          query
            .where('Nft.name ilike :name', { name: `%${param}%` })
            .orWhere('challenge.name ilike :name', { name: `%${param}%` });
        }),
      )
      .andWhere('Nft.status = 1')
      .andWhere('Nft.collectionType = :collectionType', {
        collectionType: collection,
      })
      .orderBy('Nft.totalTradingAmount', 'DESC')
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

  async getSearchByType(type: string, param: string): Promise<any> {
    return await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .where('Nft.nftType = :type', { type: type })
      .andWhere(
        new Brackets((query) => {
          query
            .where('Nft.name ilike :name', { name: `%${param}%` })
            .orWhere('challenge.name ilike :name', { name: `%${param}%` });
        }),
      )
      .orderBy('Nft.totalTradingAmount', 'DESC')
      .getMany();
  }

  async getNftsByFiltersLiked(
    paginationDto: PaginationDto,
    sortBy,
    param,
    ownerAddress,
    filters,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const chainId = filters.chain_id;
    const statusCheck = filters.statusCheck;
    let count;
    let totalCount;
    if (param == 'liked') {
      let user = await this.UsersService.getUser(ownerAddress);

      var nftIds = [];
      for (let i = 0; i < user.likes.length; i++) {
        nftIds.push(user.likes[i].assetId);
      }
      if (nftIds.length >= 1) {
        if (sortBy == 'priceLowToHigh' || sortBy == 'priceHighToLow') {
          count = await this.nftsRepository
            .createQueryBuilder('Nft')
            .leftJoinAndSelect('Nft.offers', 'offer')
            .leftJoinAndSelect('offer.bids', 'bid')
            .where('Nft.id IN (:...ids)', { ids: nftIds })
            .andWhere(
              statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1',
              {
                nftStatus: 1,
              },
            )
            .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
              chain_id: chainId,
            })
            .andWhere('offer.id IS NOT NULL')
            .andWhere('Nft.supply > 0')
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  if (
                    key == 'holder' ||
                    key == 'nftType' ||
                    key == 'collectionType' ||
                    key == 'creator'
                  ) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (first) {
                      query.where(`Nft.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                    }
                  }
                }
              }),
            )
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }),
            )
            .getMany();
          totalCount = count.length;
        } else if (sortBy == 'auctionEND') {
          let date = new Date();
          let time = date.getTime();
          count = await this.nftsRepository
            .createQueryBuilder('Nft')
            .leftJoinAndSelect('Nft.offers', 'offer')
            .leftJoinAndSelect('offer.bids', 'bid')
            .where('Nft.id IN (:...ids)', { ids: nftIds })
            .andWhere('Nft.supply > 0')
            .andWhere(
              statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1',
              {
                nftStatus: 1,
              },
            )
            .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
              chain_id: chainId,
            })
            .andWhere('offer.expiresAt >= :date', { date: time })
            .andWhere('offer.id IS NOT NULL')
            .andWhere('offer.isForAuction = :auction', { auction: true })
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  if (
                    key == 'holder' ||
                    key == 'nftType' ||
                    key == 'collectionType' ||
                    key == 'creator'
                  ) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (first) {
                      query.where(`Nft.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                    }
                  }
                }
              }),
            )
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }),
            )
            .getMany();
          totalCount = count.length;
        } else if (sortBy == 'challengeEND') {
          let date = new Date();
          let time = date.getTime();
          count = await this.nftsRepository
            .createQueryBuilder('Nft')
            .leftJoinAndSelect('Nft.offers', 'offer')
            .leftJoinAndSelect('Nft.challenges', 'challenge')
            .leftJoinAndSelect('offer.bids', 'bid')
            .where('Nft.id IN (:...ids)', { ids: nftIds })
            .andWhere('Nft.supply > 0')
            .andWhere(
              statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1',
              {
                nftStatus: 1,
              },
            )
            .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
              chain_id: chainId,
            })
            .andWhere('Nft.nftType = :nftType', { nftType: 'nft_challenge' })
            .andWhere('challenge.expiresAt > :date', { date: time })
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  if (
                    key == 'holder' ||
                    key == 'nftType' ||
                    key == 'collectionType' ||
                    key == 'creator'
                  ) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (first) {
                      query.where(`Nft.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                    }
                  }
                }
              }),
            )
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }),
            )
            .getMany();
          totalCount = count.length;
        } else {
          count = await this.nftsRepository
            .createQueryBuilder('Nft')
            .leftJoinAndSelect('Nft.offers', 'offer')
            .leftJoinAndSelect('offer.bids', 'bid')
            .where('Nft.id IN (:...ids)', { ids: nftIds })
            .andWhere('Nft.supply > 0')
            .andWhere(
              statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1',
              {
                nftStatus: 1,
              },
            )
            .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
              chain_id: chainId,
            })
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  if (
                    key == 'holder' ||
                    key == 'nftType' ||
                    key == 'collectionType' ||
                    key == 'creator'
                  ) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (first) {
                      query.where(`Nft.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                    }
                  }
                }
              }),
            )
            .andWhere(
              new Brackets((query) => {
                let first = true;
                if (
                  filters.isForSell == 'false' &&
                  filters.isForAuction == 'false'
                ) {
                  new Brackets((query) => {
                    query.where('offer.id IS NULL');
                  });
                } else {
                  for (let key of Object.keys(filters)) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (
                      key == 'isForSell' ||
                      key == 'isForAuction' ||
                      key == 'currency'
                    ) {
                      if (first) {
                        query.where(`offer.${key} = :${key}`, filterAttribute);
                        first = false;
                      } else {
                        query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                      }
                    } else if (key == 'price') {
                      const myArr = filters[key].split('-');
                      if (first) {
                        query.where(`offer.price <= :maxPrice`, {
                          maxPrice: parseFloat(myArr[1]),
                        });
                        query.andWhere(`offer.price >= :minPrice`, {
                          minPrice: parseFloat(myArr[0]),
                        });
                        first = false;
                      } else {
                        query.andWhere(`offer.price <= :maxPrice`, {
                          maxPrice: parseFloat(myArr[1]),
                        });
                        query.andWhere(`offer.price >= :minPrice`, {
                          minPrice: parseFloat(myArr[0]),
                        });
                      }
                    }
                  }
                }
              }),
            )
            .getMany();
          totalCount = count.length;
        }

        var nfts;
        if (sortBy == 'all') {
          nfts = await this.nftsRepository
            .createQueryBuilder('Nft')
            .leftJoinAndSelect('Nft.offers', 'offer')
            .leftJoinAndSelect('offer.bids', 'bid')
            .where('Nft.id IN (:...ids)', { ids: nftIds })
            .andWhere('Nft.supply > 0')
            .andWhere(
              statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1',
              {
                nftStatus: 1,
              },
            )
            .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
              chain_id: chainId,
            })
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  if (
                    key == 'holder' ||
                    key == 'nftType' ||
                    key == 'collectionType' ||
                    key == 'creator'
                  ) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (first) {
                      query.where(`Nft.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                    }
                  }
                }
              }),
            )
            .andWhere(
              new Brackets((query) => {
                let first = true;
                if (
                  filters.isForSell == 'false' &&
                  filters.isForAuction == 'false'
                ) {
                  new Brackets((query) => {
                    query.where('offer.id IS NULL');
                  });
                } else {
                  for (let key of Object.keys(filters)) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (
                      key == 'isForSell' ||
                      key == 'isForAuction' ||
                      key == 'currency'
                    ) {
                      if (first) {
                        query.where(`offer.${key} = :${key}`, filterAttribute);
                        first = false;
                      } else {
                        query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                      }
                    } else if (key == 'price') {
                      const myArr = filters[key].split('-');
                      if (first) {
                        query.where(`offer.price <= :maxPrice`, {
                          maxPrice: parseFloat(myArr[1]),
                        });
                        query.andWhere(`offer.price >= :minPrice`, {
                          minPrice: parseFloat(myArr[0]),
                        });
                        first = false;
                      } else {
                        query.andWhere(`offer.price <= :maxPrice`, {
                          maxPrice: parseFloat(myArr[1]),
                        });
                        query.andWhere(`offer.price >= :minPrice`, {
                          minPrice: parseFloat(myArr[0]),
                        });
                      }
                    }
                  }
                }
              }),
            )
            .addOrderBy('offer.isForSell', 'DESC')
            .skip(skippedItems)
            .take(paginationDto.limit)
            .getMany();
        } else if (sortBy == 'recent') {
          nfts = await this.nftsRepository
            .createQueryBuilder('Nft')
            .leftJoinAndSelect('Nft.offers', 'offer')
            .leftJoinAndSelect('offer.bids', 'bid')
            .where('Nft.id IN (:...ids)', { ids: nftIds })
            .andWhere('Nft.supply > 0')
            .andWhere(
              statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1',
              {
                nftStatus: 1,
              },
            )
            .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
              chain_id: chainId,
            })
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  if (
                    key == 'holder' ||
                    key == 'nftType' ||
                    key == 'collectionType' ||
                    key == 'creator'
                  ) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (first) {
                      query.where(`Nft.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                    }
                  }
                }
              }),
            )
            .andWhere(
              new Brackets((query) => {
                let first = true;
                if (
                  filters.isForSell == 'false' &&
                  filters.isForAuction == 'false'
                ) {
                  new Brackets((query) => {
                    query.where('offer.id IS NULL');
                  });
                } else {
                  for (let key of Object.keys(filters)) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (
                      key == 'isForSell' ||
                      key == 'isForAuction' ||
                      key == 'currency'
                    ) {
                      if (first) {
                        query.where(`offer.${key} = :${key}`, filterAttribute);
                        first = false;
                      } else {
                        query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                      }
                    } else if (key == 'price') {
                      const myArr = filters[key].split('-');
                      if (first) {
                        query.where(`offer.price <= :maxPrice`, {
                          maxPrice: parseFloat(myArr[1]),
                        });
                        query.andWhere(`offer.price >= :minPrice`, {
                          minPrice: parseFloat(myArr[0]),
                        });
                        first = false;
                      } else {
                        query.andWhere(`offer.price <= :maxPrice`, {
                          maxPrice: parseFloat(myArr[1]),
                        });
                        query.andWhere(`offer.price >= :minPrice`, {
                          minPrice: parseFloat(myArr[0]),
                        });
                      }
                    }
                  }
                }
              }),
            )
            .addOrderBy('Nft.createdAt', 'DESC')
            .addOrderBy('offer.isForSell', 'DESC')
            .skip(skippedItems)
            .take(paginationDto.limit)
            .getMany();
        } else if (sortBy == 'priceLowToHigh' || sortBy == 'priceHighToLow') {
          nfts = await this.nftsRepository
            .createQueryBuilder('Nft')
            .leftJoinAndSelect('Nft.offers', 'offer')
            .leftJoinAndSelect('offer.bids', 'bid')
            .where('Nft.id IN (:...ids)', { ids: nftIds })
            .andWhere('Nft.supply > 0')
            .andWhere(
              statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1',
              {
                nftStatus: 1,
              },
            )
            .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
              chain_id: chainId,
            })
            .andWhere('offer.id IS NOT NULL')
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  if (
                    key == 'holder' ||
                    key == 'nftType' ||
                    key == 'collectionType' ||
                    key == 'creator'
                  ) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (first) {
                      query.where(`Nft.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                    }
                  }
                }
              }),
            )
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }),
            )
            .addOrderBy(
              'offer.price',
              sortBy == 'priceLowToHigh' ? 'ASC' : 'DESC',
            )
            .addOrderBy('offer.isForSell', 'DESC')
            .skip(skippedItems)
            .take(paginationDto.limit)
            .getMany();
        } else if (sortBy == 'auctionEND') {
          let date = new Date();
          let time = date.getTime();
          nfts = await this.nftsRepository
            .createQueryBuilder('Nft')
            .leftJoinAndSelect('Nft.offers', 'offer')
            .leftJoinAndSelect('offer.bids', 'bid')
            .where('Nft.id IN (:...ids)', { ids: nftIds })
            .andWhere('Nft.supply > 0')
            .andWhere(
              statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1',
              {
                nftStatus: 1,
              },
            )
            .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
              chain_id: chainId,
            })
            .andWhere('offer.id IS NOT NULL')
            .andWhere('offer.expiresAt >= :date', { date: time })
            .andWhere('offer.isForAuction = :auction', { auction: true })
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  if (
                    key == 'holder' ||
                    key == 'nftType' ||
                    key == 'collectionType' ||
                    key == 'creator'
                  ) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (first) {
                      query.where(`Nft.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                    }
                  }
                }
              }),
            )
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }),
            )
            .addOrderBy('offer.expiresAt', 'ASC')
            .addOrderBy('offer.isForSell', 'DESC')
            .skip(skippedItems)
            .take(paginationDto.limit)
            .getMany();
        } else if (sortBy == 'challengeEND') {
          const date = new Date();
          const time = date.getTime();
          nfts = await this.nftsRepository
            .createQueryBuilder('Nft')
            .leftJoinAndSelect('Nft.offers', 'offer')
            .leftJoinAndSelect('Nft.challenges', 'challenge')
            .leftJoinAndSelect('offer.bids', 'bid')
            .where('Nft.id IN (:...ids)', { ids: nftIds })
            .andWhere('Nft.supply > 0')
            .andWhere(
              statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1',
              {
                nftStatus: 1,
              },
            )
            .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
              chain_id: chainId,
            })
            .andWhere('Nft.nftType = :nftType', { nftType: 'nft_challenge' })
            .andWhere('challenge.expiresAt > :date', { date: time })
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  if (
                    key == 'holder' ||
                    key == 'nftType' ||
                    key == 'collectionType' ||
                    key == 'creator'
                  ) {
                    let filterAttribute = {};
                    filterAttribute[key] = filters[key];
                    if (first) {
                      query.where(`Nft.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                    }
                  }
                }
              }),
            )
            .andWhere(
              new Brackets((query) => {
                let first = true;
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }),
            )
            .addOrderBy('challenge.expiresAt', 'ASC')
            .skip(skippedItems)
            .take(paginationDto.limit)
            .getMany();
        }
        return {
          totalCount,
          page: paginationDto.page,
          limit: paginationDto.limit,
          data: nfts,
        };
      } else {
        totalCount = 0;
        nfts = {};
      }
    } else if (param == 'live') {
      //Live Start
      //count
      if (sortBy == 'priceLowToHigh' || sortBy == 'priceHighToLow') {
        count = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('offer.id IS NOT NULL')
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .getMany();
        totalCount = count.length;
      } else if (sortBy == 'auctionEND') {
        count = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('offer.id IS NOT NULL')
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere('offer.isForAuction = :auction', { auction: true })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .getMany();
        totalCount = count.length;
      } else if (sortBy == 'challengeEND') {
        count = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('Nft.challenges', 'challenge')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('Nft.nftType = :nftType', { nftType: 'nft_challenge' })
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              query.where('offer.isForSell = :value', {
                value: true,
              });
              query.orWhere('challenge.expiresAt > :time', {
                time: new Date().getTime(),
              });
            }),
          )
          .getMany();
        totalCount = count.length;
      } else {
        count = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('Nft.challenges', 'challenge')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              if (
                filters.isForSell == 'false' &&
                filters.isForAuction == 'false'
              ) {
                new Brackets((query) => {
                  query.where('offer.id IS NULL');
                });
              } else {
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              query.where('offer.isForSell = :value', {
                value: true,
              });
              query.orWhere('challenge.expiresAt > :time', {
                time: new Date().getTime(),
              });
            }),
          )
          .getMany();
        totalCount = count.length;
      }

      //Nfts
      if (sortBy == 'all') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('Nft.challenges', 'challenge')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              if (
                filters.isForSell == 'false' &&
                filters.isForAuction == 'false'
              ) {
                new Brackets((query) => {
                  query.where('offer.id IS NULL');
                });
              } else {
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              query.where('offer.isForSell = :value', {
                value: true,
              });
              query.orWhere('challenge.expiresAt > :time', {
                time: new Date().getTime(),
              });
            }),
          )
          .addOrderBy('Nft.createdAt', 'DESC')
          .addOrderBy('offer.isForSell', 'DESC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      } else if (sortBy == 'recent') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('Nft.challenges', 'challenge')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              if (
                filters.isForSell == 'false' &&
                filters.isForAuction == 'false'
              ) {
                new Brackets((query) => {
                  query.where('offer.id IS NULL');
                });
              } else {
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              query.where('offer.isForSell = :value', {
                value: true,
              });
              query.orWhere('challenge.expiresAt > :time', {
                time: new Date().getTime(),
              });
            }),
          )
          .addOrderBy('Nft.createdAt', 'DESC')
          .addOrderBy('offer.isForSell', 'DESC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      } else if (sortBy == 'priceLowToHigh' || sortBy == 'priceHighToLow') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('offer.id IS NOT NULL')
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .addOrderBy(
            'offer.price',
            sortBy == 'priceLowToHigh' ? 'ASC' : 'DESC',
          )
          .addOrderBy('offer.isForSell', 'DESC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      } else if (sortBy == 'auctionEND') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('offer.id IS NOT NULL')
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere('offer.isForAuction = :auction', { auction: true })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .addOrderBy('offer.expiresAt', 'ASC')
          .addOrderBy('offer.isForSell', 'DESC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      } else if (sortBy == 'challengeEND') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .leftJoinAndSelect('Nft.challenges', 'challenge')
          .where('Nft.nftType = :nftType', { nftType: 'nft_challenge' })
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              query.where('offer.isForSell = :value', {
                value: true,
              });
              query.orWhere('challenge.expiresAt > :time', {
                time: new Date().getTime(),
              });
            }),
          )
          .addOrderBy('challenge.expiresAt', 'ASC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      }
      //Live end
    } else {
      if (sortBy == 'priceLowToHigh' || sortBy == 'priceHighToLow') {
        count = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('offer.id IS NOT NULL')
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .getMany();
        totalCount = count.length;
      } else if (sortBy == 'auctionEND') {
        count = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('offer.id IS NOT NULL')
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere('offer.isForAuction = :auction', { auction: true })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .getMany();
        totalCount = count.length;
      } else if (sortBy == 'challengeEND') {
        count = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('Nft.challenges', 'challenge')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('Nft.nftType = :nftType', { nftType: 'nft_challenge' })
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere('challenge.expiresAt > :date', {
            date: new Date().getTime(),
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .getMany();
        totalCount = count.length;
      } else {
        count = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              if (
                filters.isForSell == 'false' &&
                filters.isForAuction == 'false'
              ) {
                new Brackets((query) => {
                  query.where('offer.id IS NULL');
                });
              } else {
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }
            }),
          )
          .getMany();
        totalCount = count.length;
      }

      if (sortBy == 'all') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              if (
                filters.isForSell == 'false' &&
                filters.isForAuction == 'false'
              ) {
                new Brackets((query) => {
                  query.where('offer.id IS NULL');
                });
              } else {
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }
            }),
          )
          .addOrderBy('offer.isForSell', 'DESC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      } else if (sortBy == 'recent') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              if (
                filters.isForSell == 'false' &&
                filters.isForAuction == 'false'
              ) {
                new Brackets((query) => {
                  query.where('offer.id IS NULL');
                });
              } else {
                for (let key of Object.keys(filters)) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (
                    key == 'isForSell' ||
                    key == 'isForAuction' ||
                    key == 'currency'
                  ) {
                    if (first) {
                      query.where(`offer.${key} = :${key}`, filterAttribute);
                      first = false;
                    } else {
                      query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                    }
                  } else if (key == 'price') {
                    const myArr = filters[key].split('-');
                    if (first) {
                      query.where(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                      first = false;
                    } else {
                      query.andWhere(`offer.price <= :maxPrice`, {
                        maxPrice: parseFloat(myArr[1]),
                      });
                      query.andWhere(`offer.price >= :minPrice`, {
                        minPrice: parseFloat(myArr[0]),
                      });
                    }
                  }
                }
              }
            }),
          )
          .addOrderBy('Nft.createdAt', 'DESC')
          .addOrderBy('offer.isForSell', 'DESC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      } else if (sortBy == 'priceLowToHigh' || sortBy == 'priceHighToLow') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('offer.id IS NOT NULL')
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .addOrderBy(
            'offer.price',
            sortBy == 'priceLowToHigh' ? 'ASC' : 'DESC',
          )
          .addOrderBy('offer.isForSell', 'DESC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      } else if (sortBy == 'auctionEND') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('offer.id IS NOT NULL')
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere('offer.isForAuction = :auction', { auction: true })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .addOrderBy('offer.expiresAt', 'ASC')
          .addOrderBy('offer.isForSell', 'DESC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      } else if (sortBy == 'challengeEND') {
        nfts = await this.nftsRepository
          .createQueryBuilder('Nft')
          .leftJoinAndSelect('Nft.offers', 'offer')
          .leftJoinAndSelect('Nft.challenges', 'challenge')
          .leftJoinAndSelect('offer.bids', 'bid')
          .where('Nft.nftType = :nftType', { nftType: 'nft_challenge' })
          .andWhere('Nft.supply > 0')
          .andWhere(statusCheck == 'true' ? `Nft.status = :nftStatus` : '1=1', {
            nftStatus: 1,
          })
          .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
            chain_id: chainId,
          })
          .andWhere('challenge.expiresAt > :date', {
            date: new Date().getTime(),
          })
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                if (
                  key == 'holder' ||
                  key == 'nftType' ||
                  key == 'collectionType' ||
                  key == 'creator'
                ) {
                  let filterAttribute = {};
                  filterAttribute[key] = filters[key];
                  if (first) {
                    query.where(`Nft.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`Nft.${key} = :${key}`, filterAttribute);
                  }
                }
              }
            }),
          )
          .andWhere(
            new Brackets((query) => {
              let first = true;
              for (let key of Object.keys(filters)) {
                let filterAttribute = {};
                filterAttribute[key] = filters[key];
                if (
                  key == 'isForSell' ||
                  key == 'isForAuction' ||
                  key == 'currency'
                ) {
                  if (first) {
                    query.where(`offer.${key} = :${key}`, filterAttribute);
                    first = false;
                  } else {
                    query.andWhere(`offer.${key} = :${key}`, filterAttribute);
                  }
                } else if (key == 'price') {
                  const myArr = filters[key].split('-');
                  if (first) {
                    query.where(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                    first = false;
                  } else {
                    query.andWhere(`offer.price <= :maxPrice`, {
                      maxPrice: parseFloat(myArr[1]),
                    });
                    query.andWhere(`offer.price >= :minPrice`, {
                      minPrice: parseFloat(myArr[0]),
                    });
                  }
                }
              }
            }),
          )
          .addOrderBy('challenge.expiresAt', 'ASC')
          .skip(skippedItems)
          .take(paginationDto.limit)
          .getMany();
      }
    }
    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: nfts,
    };
  }

  async getNftsForChallenge(
    paginationDto: PaginationDto,
    holder: string,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const chainId = paginationDto.chainId;
    const count = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .where('offer.id IS NULL')
      .andWhere('Nft.supply > 0')
      .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere('Nft.airdropped = :airdropped', { airdropped: false })
      .andWhere(
        new Brackets((query) => {
          query
            .where('Nft.resale = :resale', { resale: true })
            .orWhere('Nft.holder = Nft.creator');
        }),
      )
      .andWhere(
        new Brackets((query) => {
          query
            .where('challenge.id IS NULL')
            .orWhere('challenge.status = :status', { status: 2 });
        }),
      )
      .andWhere('Nft.holder = :holder', { holder: holder })
      .getMany();
    const totalCount = count.length;

    const nfts = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('Nft.challenges', 'challenge')
      .where('offer.id IS NULL')
      .andWhere('Nft.supply > 0')
      .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .andWhere('Nft.airdropped = :airdropped', { airdropped: false })
      .andWhere(
        new Brackets((query) => {
          query
            .where('Nft.resale = :resale', { resale: true })
            .orWhere('Nft.holder = Nft.creator');
        }),
      )
      .andWhere(
        new Brackets((query) => {
          query
            .where('challenge.id IS NULL')
            .orWhere('challenge.status = :status', { status: 2 });
        }),
      )
      .andWhere('Nft.holder = :holder', { holder: holder })
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

  async getNFTByAssetIdAndCollectionAndHolder(
    assetId: string,
    collectionType: string,
    holder: string,
  ): Promise<any> {
    return this.nftsRepository
      .createQueryBuilder('Nft')
      .where('Nft.assetId = :assetId', { assetId: assetId })
      .andWhere('LOWER(Nft.collectionType) = LOWER(:collectionType)', {
        collectionType: collectionType,
      })
      .andWhere('LOWER(Nft.holder) = LOWER(:holder)', {
        holder: holder,
      })
      .getOne();
  }

  async getAdminNfts(
    paginationDto: PaginationDto,
    order,
  ): Promise<PaginatedResultDto> {
    const skippedItems = (paginationDto.page - 1) * paginationDto.limit;
    const chainId = Number(paginationDto.chainId);
    const totalCount = await this.nftsRepository
      .createQueryBuilder('Nft')
      .andWhere('Nft.supply > 0')
      .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .getCount();

    const nfts = await this.nftsRepository
      .createQueryBuilder('Nft')
      .leftJoinAndSelect('Nft.offers', 'offer')
      .leftJoinAndSelect('offer.bids', 'bid')
      .andWhere('Nft.supply > 0')
      .andWhere(chainId > 0 ? `Nft.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .orderBy({ 'Nft.createdAt': order })
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
