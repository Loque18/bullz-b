import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';
import { CreateReportDTO } from './dto/create-report.dto';
import { UpdateReportDTO } from './dto/update-report.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CollectionService } from 'src/collection/collection.service';
import { NftsService } from 'src/nfts/nft.service';
import { ChallengesService } from 'src/nft-challenge/challenges/challenge.service';

@Controller('reports')
export class ReportController {
  constructor(
    private reportsService: ReportsService,
    private usersService: UsersService,
    private collectionService: CollectionService,
    private nftsService: NftsService,
    private challengeService: ChallengesService,
  ) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Report,
  })
  @ApiBody({ description: 'CreateReportDTO', type: CreateReportDTO })
  @UseGuards(JwtAuthGuard)
  @Post()
  async addReport(@Body() createReportDTO: CreateReportDTO) {
    console.log(createReportDTO);
    const existingReport = await this.reportsService.getExistingReport(
      createReportDTO.reporter_id,
      createReportDTO.reported_id,
      createReportDTO.report_for,
    );
    if (existingReport) {
      throw new HttpException(
        'You already submitted a report for this.',
        HttpStatus.CONFLICT,
      );
    }
    const report = await this.reportsService.addReport(createReportDTO);
    return report;
  }

  @ApiResponse({
    status: 200,
    type: Report,
    isArray: true,
    description: 'list reports',
  })
  @Get()
  async getReports() {
    const reports = await this.reportsService.getReports();

    for (let i = 0; i < reports.length; i++) {
      const report = reports[i];
      const reporter = await this.usersService.getUserById(report.reporter_id);
      reports[i].reporter = reporter;

      switch (report.report_for) {
        case 'user':
          const reportedUser = await this.usersService.getUserById(
            report.reported_id,
          );
          reports[i].reported = reportedUser;
          break;
        case 'collection':
          const reportedCollection = await this.collectionService.getCollectionsById(
            report.reported_id,
          );
          reports[i].reported = reportedCollection;
          break;

        case 'nft':
          const reportedNFT = await this.nftsService.getNftById(
            report.reported_id,
          );
          reports[i].reported = reportedNFT;
          break;
        case 'challenge':
          const reportedChallenge = await this.challengeService.getChallengeById(
            report.reported_id,
          );
          reports[i].reported = reportedChallenge;
          break;
        case 'default':
          break;
      }
    }

    return reports;
  }
  @Get('/filter')
  async getReportsBy(
    @Query('sortBy') sortBy: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string,
  ) {
    const reports = await this.reportsService.getReportsBy(sortBy, limit, skip);

    for (let i = 0; i < reports.data.length; i++) {
      const report = reports.data[i];
      const reporter = await this.usersService.getUserById(report.reporter_id);
      reports.data[i].reporter = reporter;

      switch (report.report_for) {
        case 'user':
          const reportedUser = await this.usersService.getUserById(
            report.reported_id,
          );
          reports.data[i].reported = reportedUser;
          break;
        case 'collection':
          const reportedCollection = await this.collectionService.getCollectionsById(
            report.reported_id,
          );
          reports.data[i].reported = reportedCollection;
          break;

        case 'nft':
          const reportedNFT = await this.nftsService.getNftById(
            report.reported_id,
          );
          reports.data[i].reported = reportedNFT;
          break;
        case 'challenge':
          const reportedChallenge = await this.challengeService.getChallengeById(
            report.reported_id,
          );
          reports.data[i].reported = reportedChallenge;
          break;
        case 'default':
          break;
      }
    }

    return reports;
  }

  @ApiResponse({
    status: 200,
    type: Report,
    isArray: true,
    description: 'list eth addresses',
  })
  @Get('/pending-reports')
  async getPendingReports(@Query('limit') limit: number) {
    const reports = await this.reportsService.getPendingReports(limit);
    return reports;
  }

  @ApiResponse({
    status: 200,
    type: Number,
    isArray: false,
    description: 'pending report count',
  })
  @Get('/pending-count')
  async getReportPendingCount(
    @Query('startDate') startDate,
    @Query('endDate') endDate,
  ) {
    const count = await this.reportsService.getPendingReportsCount(
      startDate,
      endDate,
    );
    return count;
  }

  @ApiResponse({
    status: 200,
    type: Report,
    isArray: false,
    description: 'Report Detail',
  })
  @Get('/getbyid/:id')
  async getReportById(@Param('id') id) {
    const report = await this.reportsService.getById(id);
    if (report) {
      const reporter = await this.usersService.getUserById(report.reporter_id);
      report.reporter = reporter;

      switch (report.report_for) {
        case 'user':
          const reportedUser = await this.usersService.getUserById(
            report.reported_id,
          );
          report.reported = reportedUser;
          break;
        case 'collection':
          const reportedCollection = await this.collectionService.getCollectionsById(
            report.reported_id,
          );
          report.reported = reportedCollection;
          break;

        case 'nft':
          const reportedNFT = await this.nftsService.getNftById(
            report.reported_id,
          );
          report.reported = reportedNFT;
          break;
        case 'challenge':
          const reportedChallenge = await this.challengeService.getChallengeById(
            report.reported_id,
          );
          report.reported = reportedChallenge;
          break;
        case 'default':
          break;
      }
      return report;
    } else {
      return 'Report not found';
    }
  }

  @ApiBody({
    description: 'Update report',
    type: UpdateReportDTO,
  })
  @ApiResponse({
    description: 'The record has been successfully updated.',
    type: UpdateResult,
  })
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateReport(@Body() updateReportDTO: UpdateReportDTO) {
    const result = await this.reportsService.update(updateReportDTO);
    return result;
  }

  // @ApiQuery({ name: 'id' })
  // @UseGuards(JwtAuthGuard)
  // @Delete('/:id')
  // @ApiResponse({
  //   description: 'The record has been successfully deleted.',
  //   type: DeleteResult,
  // })
  // async deleteReport(@Param('id') id: string) {
  //   const result = await this.reportsService.remove(id);
  //   return result;
  // }
}
