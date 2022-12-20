import { Injectable } from '@nestjs/common';
import { NftScanner } from './nft-scanner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNftScannerDTO } from './dto/create-nft-scanner.dto';
import { UpdateNftScannerDTO } from './dto/update-nft-scanner.dto';

@Injectable()
export class NftScannerService {
  constructor(
    @InjectRepository(NftScanner)
    private nftScannerRepository: Repository<NftScanner>,
  ) {}

  addNftScanner(createNftScannerDTO: CreateNftScannerDTO): Promise<any> {
    return this.nftScannerRepository.save(createNftScannerDTO);
  }

  getNftScanners(): Promise<any> {
    return this.nftScannerRepository.find();
  }

  getById(id): Promise<any> {
    return this.nftScannerRepository
      .createQueryBuilder('NftScanner')
      .where({ id: id })
      .getOne();
  }

  getByAddressAndChainIdAndType(address, chain_id, asset_type): Promise<any> {
    console.log('getByAddress', address);
    return this.nftScannerRepository
      .createQueryBuilder('NftScanner')
      .where('LOWER(NftScanner.user) = LOWER(:address)', { address: address })
      .andWhere('NftScanner.chain_id = :chain_id', { chain_id: chain_id })
      .andWhere('NftScanner.asset_type = :asset_type', {
        asset_type: asset_type,
      })
      .getOne();
  }

  update(updateNftScannerDTO: UpdateNftScannerDTO): Promise<any> {
    return this.nftScannerRepository.update(
      updateNftScannerDTO.id,
      updateNftScannerDTO,
    );
  }

  remove(id: string): Promise<any> {
    return this.nftScannerRepository.delete(id);
  }
}
