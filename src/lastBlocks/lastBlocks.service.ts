import { Injectable } from '@nestjs/common';
import { LastBlock } from './lastBlock.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreateLastBlockDTO } from './dto/create-lastBlock.dto';
import { UpdateLasBlockDTO } from './dto/update-lastBlock.dto';

@Injectable()
export class LastBlocksService {
  constructor(
    @InjectRepository(LastBlock)
    private lastBlocksRepository: Repository<LastBlock>,
  ) {}

  add(lastBlock): Promise<any> {
    return this.lastBlocksRepository.save(lastBlock);
  }

  getLastBlockByEventName(event_name): Promise<any> {
    return this.lastBlocksRepository
      .createQueryBuilder('LastBlock')
      .where('LastBlock.event_name = :event_name', { event_name: event_name })
      .getOne();
  }

  update(updateLasBlockDTO: UpdateLasBlockDTO): Promise<any> {
    return this.lastBlocksRepository.update(
      updateLasBlockDTO.id,
      updateLasBlockDTO,
    );
  }

  remove(id: string): Promise<DeleteResult> {
    return this.lastBlocksRepository.delete(id);
  }
}
