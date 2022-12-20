import { Injectable } from '@nestjs/common';
import { Offer } from './offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nft } from 'src/nfts/nft.entity';
import { UpdateOfferDTO } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private OffersRepository: Repository<Offer>,
  ) {}

  getOffers(): Promise<any> {
    return this.OffersRepository.find({
      relations: ['bids'],
      order: {
        id: 'DESC',
      },
    });
  }
  getOffersByNFT(nft_id): Promise<any> {
    return this.OffersRepository.find({
      relations: ['bids'],
      order: {
        id: 'DESC',
      },
      where: [
        {
          nft: { id: nft_id },
        },
      ],
    });
  }

  getOffer(seller: string): Promise<any> {
    return this.OffersRepository.find({
      where: [{ seller: seller }],
      order: {
        id: 'DESC',
      },
    });
  }
  updateOffer(updateOfferDTO: UpdateOfferDTO): Promise<any> {
    return this.OffersRepository.update(updateOfferDTO.id, updateOfferDTO);
  }
  addOffer(offer): Promise<any> {
    let nft = new Nft();
    nft.id = offer.nft_id;
    offer.nft = nft;
    return this.OffersRepository.save(offer);
  }

  async remove(id: string): Promise<void> {
    await this.OffersRepository.delete(id);
  }
}
