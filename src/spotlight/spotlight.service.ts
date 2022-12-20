import { Injectable } from '@nestjs/common';
import { Spotlight } from './spotlight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpotlightDTO } from './dto/create-spotlight.dto';
import { UpdateSpotlightDTO } from './dto/update-spotlight.dto';
import { Challenge } from 'src/nft-challenge/challenges/challenge.entity';
// import { NftsService } from 'src/nfts/nft.service';

@Injectable()
export class SpotlightsService {
  constructor(
    @InjectRepository(Spotlight)
    private spotlightsRepository: Repository<Spotlight>,
  ) {}

  async getSpotlights(limit, chainId): Promise<any> {
    const data = await this.spotlightsRepository
      .createQueryBuilder('Spotlight')
      .where(chainId > 0 ? `Spotlight.chain_id = :chain_id` : '1=1', {
        chain_id: chainId,
      })
      .take(limit)
      .getMany();
    return data;
  }

  // async getAdminSpotlights(chainId): Promise<any> {
  //   const data = await this.spotlightsRepository
  //     .createQueryBuilder('Spotlight')
  //     .where(chainId > 0 ? `Spotlight.chain_id = :chain_id` : '1=1', {
  //       chain_id: chainId,
  //     })
  //     .getMany();
  //   return data;
  // }

  async getSpotlightByChallengeId(challenge_id): Promise<any> {
    const data = await this.spotlightsRepository
      .createQueryBuilder('Spotlight')
      .leftJoinAndSelect('Spotlight.challenge', 'challenge')
      .where('challenge.id = :id', { id: challenge_id })
      .getOne();
    return data;
  }

  update(updateSpotlightDTO: UpdateSpotlightDTO): Promise<any> {
    return this.spotlightsRepository.update(
      updateSpotlightDTO.id,
      updateSpotlightDTO,
    );
  }

  async updateOrders(spolights): Promise<any> {
    for (let i = 0; i < spolights.length; i++) {
      const spotlight = spolights[i];
      try {
        await this.spotlightsRepository //.update(spotlight.id, spotlight);
          .createQueryBuilder()
          .update('Spotlight')
          .set({ order: spotlight.order })
          .where('id = :id', { id: spotlight.id })
          .execute();
      } catch (error) {
        console.log('error', error);
      }
    }
    return true;
  }

  addSpotlight(challenge): Promise<any> {
    const spotlight = new Spotlight();
    const _challenge = new Challenge();
    _challenge.id = challenge.id;
    spotlight.challenge = _challenge;
    spotlight.chain_id = challenge.chain_id;
    return this.spotlightsRepository.save(spotlight);
  }

  async remove(id: string): Promise<void> {
    await this.spotlightsRepository.delete(id);
  }
}
