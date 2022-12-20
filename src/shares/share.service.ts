import { Injectable } from '@nestjs/common';
import { Share } from './share.entity';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(Share)
    private shareRepository: Repository<Share>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  getShares(): Promise<any> {
    return this.shareRepository.find();
  }

  addShare(share): Promise<any> {
    return this.shareRepository.save(share);
  }

  getShareStat(startDate, endDate) {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;

    const query = `SELECT  d.ref_date :: date AS "date"
    , count(id) AS "count" FROM generate_series('${_startDate.toLocaleDateString()}' :: timestamp, '${_endDate.toLocaleDateString()}' :: timestamp, '1 day') AS d(ref_date)
    LEFT JOIN "share"
    ON date_trunc('day', d.ref_date) = date_trunc('day', "share"."createdAt")
    GROUP BY d.ref_date ORDER BY d.ref_date ASC`;
    return this.connection.query(query);
  }

  getNumberOfShare(startDate: string, endDate: string): Promise<any> {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;
    let where = {};
    if (_startDate && _endDate) {
      where = {
        createdAt: Between(new Date(_startDate), new Date(_endDate)),
      };
    } else if (_startDate) {
      where = {
        createdAt: MoreThan(new Date(_startDate)),
      };
    } else if (_endDate) {
      where = {
        createdAt: LessThan(new Date(_endDate)),
      };
    }
    return this.shareRepository.count({
      where,
    });
  }
}
