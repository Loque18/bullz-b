import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';
import { InjectRepository, InjectConnection } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { UpdateTransactionDTO } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private trasactionsRepository: Repository<Transaction>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  getTranssactions(): Promise<any> {
    return this.trasactionsRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }

  update(updateTransactionDTO: UpdateTransactionDTO): Promise<any> {
    return this.trasactionsRepository.update(
      updateTransactionDTO.id,
      updateTransactionDTO,
    );
  }
  create(createTransactionDTO: CreateTransactionDTO): Promise<any> {
    return this.trasactionsRepository.save(createTransactionDTO);
  }

  async getTotalAirdropFee(startDate: string, endDate: string): Promise<any> {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;
    const sum = await this.trasactionsRepository
      .createQueryBuilder('Transaction')
      .select('SUM(Transaction.airdrop_fee)', 'sum')
      .where(_startDate ? `Transaction.createdAt > :start_date` : '1=1', {
        start_date: _startDate,
      })
      .andWhere(_endDate ? `Transaction.createdAt < :end_date` : '1=1', {
        end_date: _endDate,
      })
      .getRawOne();
    return sum.sum;
  }

  getAirdropStat(startDate, endDate) {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;
    const query = `SELECT D.REF_DATE :: date AS "date",
    COALESCE(SUM(airdrop_fee), 0) AS "count" 
    FROM GENERATE_SERIES('${_startDate.toLocaleDateString()}' :: TIMESTAMP,
    '${_endDate.toLocaleDateString()}' :: TIMESTAMP,
    '1 day') AS D(REF_DATE)
    LEFT JOIN public."transaction" ON DATE_TRUNC('day',
    D.REF_DATE) = DATE_TRUNC('day',
    "transaction"."createdAt")
    GROUP BY D.REF_DATE
    ORDER BY D.REF_DATE ASC`;
    return this.connection.query(query);
  }

  async getTotalRoyalties(startDate: string, endDate: string): Promise<any> {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;
    const sum = await this.trasactionsRepository
      .createQueryBuilder('Transaction')
      .select('SUM(Transaction.royalty_usd)', 'sum')
      .where(_startDate ? `Transaction.createdAt > :start_date` : '1=1', {
        start_date: _startDate,
      })
      .andWhere(_endDate ? `Transaction.createdAt < :end_date` : '1=1', {
        end_date: _endDate,
      })
      .getRawOne();
    return sum.sum;
  }

  getRoyaltiesStat(startDate, endDate) {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;
    const query = `SELECT D.REF_DATE :: date AS "date",
    COALESCE(SUM(royalty_usd), 0) AS "count" 
    FROM GENERATE_SERIES('${_startDate.toLocaleDateString()}' :: TIMESTAMP,
    '${_endDate.toLocaleDateString()}' :: TIMESTAMP,
    '1 day') AS D(REF_DATE)
    LEFT JOIN public."transaction" ON DATE_TRUNC('day',
    D.REF_DATE) = DATE_TRUNC('day',
    "transaction"."createdAt")
    GROUP BY D.REF_DATE
    ORDER BY D.REF_DATE ASC`;
    return this.connection.query(query);
  }
}
