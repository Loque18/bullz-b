import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { CreateReportDTO } from './dto/create-report.dto';
import { UpdateReportDTO } from './dto/update-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  addReport(createReportDto: CreateReportDTO): Promise<any> {
    return this.reportRepository.save(createReportDto);
  }

  getReports(): Promise<any> {
    return this.reportRepository.find();
  }
  async getReportsBy(sortBy, limit, skip): Promise<any> {
    const count = await this.reportRepository
      .createQueryBuilder('Report')
      .getCount();

    const reports = await this.reportRepository
      .createQueryBuilder('Report')
      .orderBy({ 'Report.createdAt': sortBy })
      .take(parseInt(limit))
      .skip(parseInt(limit) * parseInt(skip))
      .getMany();

    return { data: reports, totalCount: count };
  }

  getPendingReports(limit: number): Promise<any> {
    return this.reportRepository
      .createQueryBuilder('Report')
      .where('Report.status = :status', { status: 0 })
      .orderBy({ createdAt: 'DESC' })
      .take(limit)
      .getMany();
  }

  getPendingReportsCount(startDate: string, endDate: string): Promise<any> {
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
    where['status'] = 0; // Counting only pending reports
    return this.reportRepository.count({
      where,
    });
  }

  getById(id): Promise<any> {
    return this.reportRepository
      .createQueryBuilder('Report')
      .where({ id: id })
      .getOne();
  }

  update(updateReportDTO: UpdateReportDTO): Promise<any> {
    return this.reportRepository.update(updateReportDTO.id, updateReportDTO);
  }

  remove(id: string): Promise<any> {
    return this.reportRepository.delete(id);
  }

  getExistingReport(reporter_id, reported_id, report_for): Promise<any> {
    return this.reportRepository
      .createQueryBuilder('Report')
      .where('Report.reporter_id = :reporter_id', { reporter_id: reporter_id })
      .andWhere('Report.reported_id = :reported_id', {
        reported_id: reported_id,
      })
      .andWhere('Report.report_for = :report_for', { report_for: report_for })
      .getOne();
  }
}
