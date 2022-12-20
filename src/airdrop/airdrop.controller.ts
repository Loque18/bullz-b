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
import { AirdropService } from './airdrop.service';
import { Airdrop } from './airdrop.entity';
import { CreateAirdropDTO } from './dto/create-airdrop.dto';
import { UpdateAirdropDTO } from './dto/update-airdrop.dto';
import { UsersService } from 'src/users/users.service';
import { NftsService } from 'src/nfts/nft.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import {
  ApiResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { query } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('airdrops')
export class AirdropController {
  constructor(
    private airdropService: AirdropService,
    private userService: UsersService,
    private nftsService: NftsService,
    private authService: AuthService,
  ) {}

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Airdrop,
  })
  @ApiBody({ description: 'CreateAirdropDTO', type: CreateAirdropDTO })
  @Post()
  async addAirdrop(@Body() createAirdropDTO: CreateAirdropDTO) {
    console.log(createAirdropDTO);
    const existedAirdrop = await this.airdropService.checkAirdropExists(
      createAirdropDTO,
    );
    if (existedAirdrop) {
      throw new HttpException(
        'Email or Eth address has already been used. Please be aware you can only apply for the airdrop once.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    const airdrop = await this.airdropService.addAirdrop(createAirdropDTO);
    return airdrop;
  }

  @ApiResponse({
    status: 200,
    type: Airdrop,
    isArray: true,
    description: 'list airdrops',
  })
  @Get()
  async getAirdrops() {
    const airdrops = await this.airdropService.getAirdrops();
    return airdrops;
  }

  @ApiResponse({
    status: 200,
    type: String,
    isArray: true,
    description: 'list eth addresses',
  })
  @Get('/pending-addresses')
  async getAirdropAddresses(@Query('limit') limit: number) {
    const airdrops = await this.airdropService.getPendingAirdrops(limit);
    const result = airdrops.map((airdropObj) => airdropObj.eth_address);
    return result;
  }

  @Get('/pending-count')
  async getAirdropPendingCount() {
    const airdropCount = await this.airdropService.getPendingAirdropsCount();
    return airdropCount;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-airdrops')
  async postAirdropUpdate(
    @Headers('authorization') authorization: string,
    @Body('owner') owner: string,
    @Body('nft_id') nft_id: number,
    @Body('collection') collection: string,
    @Body('recipients') recipients: string[],
  ) {
    const isAdmin = this.authService.verifyAdmin(authorization);
    if (isAdmin) {
      if (typeof recipients == 'string') {
        //I see when calling from postman, it comes as a string. If the value is string it is not updating the row. So should not take a risk.
        recipients = JSON.parse(recipients);
      }
      console.log('owner', owner);
      console.log('nft_id', nft_id);
      console.log('collection', collection);
      console.log('recipients', recipients);

      if (recipients.length == 0) {
        throw new HttpException(
          'Recipient list must not be empty',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const updateAirdrop = await this.airdropService.updateByAddresses(
        recipients,
      );
      console.log('updateAirdrop', updateAirdrop);

      const ownerUser = await this.userService.getUser(owner);
      console.log('ownerUser', ownerUser);
      ownerUser.ownedNFTCount = ownerUser.ownedNFTCount - 1; //In our frontend for every sale value is decreased by 1, but while creation value increased by 1 need to fix it.
      await this.userService.updateUser(ownerUser);

      const ownerNFT = await this.nftsService.getNFTByAssetIdAndCollectionAndHolder(
        nft_id.toString(),
        collection,
        owner,
      );
      let ownerNFTSupply = ownerNFT.supply;

      for (let i = 0; i < recipients.length; i++) {
        const address = recipients[i];
        const recipient = await this.userService.getUser(address);
        recipient.ownedNFTCount = recipient.ownedNFTCount + 1;
        await this.userService.updateUser(recipient);

        const holderNFT = await this.nftsService.getNFTByAssetIdAndCollectionAndHolder(
          nft_id.toString(),
          collection,
          address,
        );

        if (holderNFT) {
          console.log('user nft exists');
          holderNFT.supply = holderNFT.supply + 1;
          await this.nftsService.update(ownerNFT);
        } else {
          console.log('user nft not exists');
          const nftObj = {
            ...ownerNFT,
            isforSell: false,
            isforAuction: false,
            holder: address.toLowerCase(),
            supply: 1,
            collectionType: collection,
          };

          if (ownerNFTSupply > 1) {
            console.log('user nft created');
            delete nftObj['id'];
            await this.nftsService.addNft(nftObj);
          } else if (ownerNFTSupply == 1) {
            console.log('user nft updated');

            await this.nftsService.update(nftObj);
          }
        }
        ownerNFTSupply--;
      }

      if (ownerNFTSupply > 0) {
        console.log('owner nft updated');

        ownerNFT.supply = ownerNFTSupply;
        await this.nftsService.update(ownerNFT);
      }

      const pending = await this.airdropService.getPendingAirdropsCount();
      const result = {
        remainingSupply: ownerNFTSupply,
        pendingRecipientCount: pending,
      };
      console.log('result', result);
      return result;
      // return true;
    } else {
      throw new HttpException('User is not admin', HttpStatus.UNAUTHORIZED);
    }
  }

  // For now we wont open these apis, if needed we'll think about these
  // @ApiBody({
  //   description: 'Update airdrop',
  //   type: UpdateAirdropDTO,
  // })
  // @ApiResponse({
  //   description: 'The record has been successfully updated.',
  //   type: UpdateResult,
  // })
  // @Put()
  // async updateAirdrop(@Body() updateAirdropDTO: UpdateAirdropDTO) {
  //   const result = await this.airdropService.update(updateAirdropDTO);
  //   return result;
  // }

  // @ApiQuery({ name: 'id' })
  // @Delete('/:id')
  // @ApiResponse({
  //   description: 'The record has been successfully deleted.',
  //   type: DeleteResult,
  // })
  // async deleteAirdrop(@Param('id') id: string) {
  //   const result = await this.airdropService.remove(id);
  //   return result;
  // }
}
