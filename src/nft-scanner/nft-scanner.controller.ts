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
import { NftScannerService } from './nft-scanner.service';
import { AlchemyService } from './alchemy.service';
import { NftScanner } from './nft-scanner.entity';
import { CreateNftScannerDTO } from './dto/create-nft-scanner.dto';
import { UpdateNftScannerDTO } from './dto/update-nft-scanner.dto';
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

@Controller('nft-scanner')
export class NftScannerController {
  constructor(
    private nftScannerService: NftScannerService,
    private usersService: UsersService,
    private collectionService: CollectionService,
    private nftsService: NftsService,
    private alchemyService: AlchemyService,
  ) {}

  // @ApiCreatedResponse({
  //   description: 'The record has been successfully created.',
  //   type: NftScanner,
  // })
  // @ApiBody({ description: 'CreateNftScannerDTO', type: CreateNftScannerDTO })
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async addNftScanner(@Body() createNftScannerDTO: CreateNftScannerDTO) {
  //   console.log(createNftScannerDTO);
  //   const scanner = await this.nftScannerService.addNftScanner(
  //     createNftScannerDTO,
  //   );
  //   return scanner;
  // }

  @ApiCreatedResponse({
    description: 'The status of scanner',
    type: NftScanner,
  })
  @ApiBody({ description: 'CreateNftScannerDTO', type: CreateNftScannerDTO })
  @UseGuards(JwtAuthGuard)
  @Post('/start')
  async startScan(@Body() createNftScannerDTO: CreateNftScannerDTO) {
    console.log(createNftScannerDTO);

    let nftScan = await this.nftScannerService.getByAddressAndChainIdAndType(
      createNftScannerDTO.user,
      createNftScannerDTO.chain_id,
      1,
    );
    // console.log('nftScan', nftScan, nftScan.last_updated.getTime());

    if (!nftScan) {
      const scan = {
        user: createNftScannerDTO.user,
        last_updated: new Date(),
        status: 0,
        chain_id: createNftScannerDTO.chain_id,
        asset_type: 1,
      };
      nftScan = await this.nftScannerService.addNftScanner(scan);
    } else {
      // if (
      //   new Date().getTime() - nftScan.last_updated.getTime() <
      //   10 * 60 * 1000
      // ) {
      //   throw new HttpException(
      //     'Wait at least 10 minutes between two calls.',
      //     HttpStatus.TOO_MANY_REQUESTS,
      //   );
      // } else {
      if (nftScan.status == 0) {
        throw new HttpException(
          'Your previouss call is still in progress.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else {
        const scan = {
          ...nftScan,
          status: 0,
          last_updated: new Date(),
        };
        await this.nftScannerService.update(scan);
      }
      // }
    }

    const scanningReport = await this.alchemyService.startScan(
      createNftScannerDTO.user,
      null,
      nftScan,
      createNftScannerDTO.chain_id,
    );
    if (scanningReport) {
      return true;
    } else {
      throw new HttpException(
        'Network not supported.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @ApiCreatedResponse({
    description: 'The status of scanner',
    type: NftScanner,
  })
  @ApiBody({ description: 'CreateNftScannerDTO', type: CreateNftScannerDTO })
  @UseGuards(JwtAuthGuard)
  @Post('/getTokens')
  async getTokens(@Body() createNftScannerDTO: CreateNftScannerDTO) {
    console.log(createNftScannerDTO);

    let nftScan = await this.nftScannerService.getByAddressAndChainIdAndType(
      createNftScannerDTO.user,
      createNftScannerDTO.chain_id,
      2,
    );
    // console.log('nftScan', nftScan, nftScan.last_updated.getTime());

    if (!nftScan) {
      const scan = {
        user: createNftScannerDTO.user,
        last_updated: new Date(),
        status: 0,
        chain_id: createNftScannerDTO.chain_id,
        asset_type: 2,
      };
      nftScan = await this.nftScannerService.addNftScanner(scan);
    } else {
      // if (
      //   new Date().getTime() - nftScan.last_updated.getTime() <
      //   10 * 60 * 1000
      // ) {
      //   throw new HttpException(
      //     'Wait at least 10 minutes between two calls.',
      //     HttpStatus.TOO_MANY_REQUESTS,
      //   );
      // } else {
      // if (nftScan.status == 0) {
      //   throw new HttpException(
      //     'Your previouss call is still in progress.',
      //     HttpStatus.TOO_MANY_REQUESTS,
      //   );
      // } else {
      const scan = {
        ...nftScan,
        status: 0,
        last_updated: new Date(),
      };
      await this.nftScannerService.update(scan);
      // }
      // }
    }

    const tokens = await this.alchemyService.searchTokens(
      createNftScannerDTO.user,
      null,
      nftScan,
      createNftScannerDTO.chain_id,
    );
    if (tokens) {
      return tokens;
    } else {
      throw new HttpException(
        'Network not supported.',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @ApiCreatedResponse({
    description: 'The status of scanner',
    type: NftScanner,
  })
  @ApiBody({ description: 'CreateNftScannerDTO', type: CreateNftScannerDTO })
  @UseGuards(JwtAuthGuard)
  @Post('/refresh')
  async refreshMetadata(@Body() refreshData) {
    console.log(refreshData);
    return this.alchemyService.refreshMetadata(
      refreshData.owner,
      refreshData.address,
      refreshData.tokenId,
      refreshData.chain_id,
    );
  }

  @ApiResponse({
    status: 200,
    type: NftScanner,
    isArray: false,
    description: 'Scanner Detail',
  })
  @Get('/getbyaddress/:address')
  async getScannerByAddress(
    @Param('address') address,
    @Query('chainId') chainId,
    @Query('asset_type') asset_type,
  ) {
    const scanner = await this.nftScannerService.getByAddressAndChainIdAndType(
      address,
      parseInt(chainId),
      parseInt(asset_type),
    );
    return scanner;
  }

  // @ApiBody({
  //   description: 'Update scanner',
  //   type: UpdateNftScannerDTO,
  // })
  // @ApiResponse({
  //   description: 'The record has been successfully updated.',
  //   type: UpdateResult,
  // })
  // @UseGuards(JwtAuthGuard)
  // @Put()
  // async updateNftScanner(@Body() updateNftScannerDTO: UpdateNftScannerDTO) {
  //   const result = await this.nftScannerService.update(updateNftScannerDTO);
  //   return result;
  // }

  // @ApiQuery({ name: 'id' })
  // @UseGuards(JwtAuthGuard)
  // @Delete('/:id')
  // @ApiResponse({
  //   description: 'The record has been successfully deleted.',
  //   type: DeleteResult,
  // })
  // async deleteNftScanner(@Param('id') id: string) {
  //   const result = await this.nftScannerService.remove(id);
  //   return result;
  // }
}
