import { Injectable } from '@nestjs/common';
import { TempStorage } from './tempStorage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { UpdateTempStorageDTO } from './dto/update-tempStorage.dto';

@Injectable()
export class TempStorageService {
  constructor(
    @InjectRepository(TempStorage)
    private tempStorageService: Repository<TempStorage>,
  ) {}

  add(tempStorage): Promise<any> {
    return this.tempStorageService.save(tempStorage);
  }

  getByEventName(event_name): Promise<any> {
    return this.tempStorageService
      .createQueryBuilder('TempStorage')
      .where('TempStorage.event_name = :event_name', { event_name: event_name })
      .getOne();
  }

  getById(id): Promise<any> {
    return this.tempStorageService
      .createQueryBuilder('TempStorage')
      .where('TempStorage.id = :id', { id: id })
      .getOne();
  }

  getByEventId(eventId): Promise<any> {
    return this.tempStorageService
      .createQueryBuilder('TempStorage')
      .where('TempStorage.eventId = :eventId', { eventId: eventId })
      .getOne();
  }

  update(updateTempStorageDTO: UpdateTempStorageDTO): Promise<any> {
    return this.tempStorageService.update(
      updateTempStorageDTO.id,
      updateTempStorageDTO,
    );
  }

  remove(id: string): Promise<DeleteResult> {
    return this.tempStorageService.delete(id);
  }
}
