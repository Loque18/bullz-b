import { Injectable } from '@nestjs/common';
import { Bid } from './bid.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBidDTO } from './dto/create-bid.dto';
import { Offer } from 'src/offers/offer.entity';
import { UpdateBidDTO } from './dto/update-bid.dto';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private BidsRepository: Repository<Bid>,
  ) {}

  getBids(): Promise<any> {
    return this.BidsRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  update(updateBidDTO: UpdateBidDTO): Promise<any> {
    return this.BidsRepository.update(updateBidDTO.id, updateBidDTO);
  }
  addBid(createBidDto: CreateBidDTO): Promise<any> {
    let bid: Bid = new Bid();
    bid.bidder = createBidDto.bidder;
    bid.price = createBidDto.price;
    bid.token = createBidDto.token;
    bid.supply = createBidDto.supply;
    let offer = new Offer();
    offer.id = createBidDto.offer_id;
    bid.offer = offer;
    bid.fileUrl = createBidDto.fileUrl;
    return this.BidsRepository.save(bid);
  }

  async remove(id: string): Promise<void> {
    await this.BidsRepository.delete(id);
  }
}


//APIS not used
/*
getBid(bidder: string): Promise<any> {
  return this.BidsRepository.find({
    where: [{ bidder: bidder }],
    order: {
      id: 'DESC',
    },
  });
}*/