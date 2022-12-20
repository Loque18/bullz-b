import { Injectable } from '@nestjs/common';
import { Airdrop } from './airdrop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAirdropDTO } from './dto/create-airdrop.dto';
import { UpdateAirdropDTO } from './dto/update-airdrop.dto';

@Injectable()
export class AirdropService {
  constructor(
    @InjectRepository(Airdrop)
    private airdropRepository: Repository<Airdrop>,
  ) {}

  addAirdrop(createAirdropDto: CreateAirdropDTO): Promise<any> {
    return this.airdropRepository.save(createAirdropDto);
  }

  getAirdrops(): Promise<any> {
    return this.airdropRepository.find();
  }

  getPendingAirdrops(limit: number): Promise<any> {
    return this.airdropRepository
      .createQueryBuilder('Airdrop')
      .where('Airdrop.status = :status', { status: 0 })
      .take(limit)
      .getMany();
  }
  // .orderBy({ created_at: 'DESC' })
  getPendingAirdropsCount(): Promise<any> {
    return this.airdropRepository
      .createQueryBuilder('Airdrop')
      .where({
        status: 0,
      })
      .getCount();
  }

  checkAirdropExists(createAirdropDto: CreateAirdropDTO): Promise<any> {
    return this.airdropRepository
      .createQueryBuilder('Airdrop')
      .where('Airdrop.email_address = :email_address', {
        email_address: createAirdropDto.email_address,
      })
      .orWhere('LOWER(Airdrop.eth_address) = LOWER(:eth_address)', {
        eth_address: createAirdropDto.eth_address,
      })
      .getOne();
  }

  update(updateAirdropDTO: UpdateAirdropDTO): Promise<any> {
    return this.airdropRepository.update(updateAirdropDTO.id, updateAirdropDTO);
  }

  updateByAddresses(addresses: string[]): Promise<any> {
    //console.log('addresses', addresses);
    const lower = addresses.map((element) => {
      return element.toLowerCase();
    });
    return this.airdropRepository
      .createQueryBuilder('Airdrop')
      .update('Airdrop')
      .set({ status: 1 })
      .where('LOWER(eth_address) IN (:...addresses)', { addresses: lower })
      .execute();
  }
  remove(id: string): Promise<any> {
    return this.airdropRepository.delete(id);
  }
}
