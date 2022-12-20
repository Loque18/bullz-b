import { HttpException, Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { User } from 'src/users/users.entity';
import { Like } from './like.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { NftsService } from '../nfts/nft.service';
@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    private UsersService: UsersService,
    private NftsService: NftsService,
  ) {}
  getLikes(): Promise<any> {
    return this.likesRepository.find();
  }
  async addLike(like): Promise<any> {
    let nft, likesUpdated, count;
    const checkLike = await this.UsersService.getUserById(like.user_id);
    let found = checkLike.likes.find((i) => i.assetId === like.assetId);
    if (found) {
      //remove here
      let removed = checkLike.likes.filter((i) => i.assetId !== like.assetId);
      console.log(found);
      checkLike.likes = [...removed];
      likesUpdated = await this.UsersService.addUser(checkLike);
      nft = await this.NftsService.likeNft(like.assetId, 'sub');
      await this.likesRepository
        .createQueryBuilder()
        .delete()
        .from(Like)
        .where('id = :id', { id: found.id })
        .execute();
    } else {
      // let removed = checkLike.likes.filter(i=> i.assetId !== like.assetId )
      // checkLike.likes =[...removed];
      // console.log(checkLike)
      // await this.UsersService.addUser(checkLike);
      let user = new User();
      user.id = like.user_id;
      like.user = user;
      await this.likesRepository.save(like);
      // const checkLikeAgain = await this.UsersService.getUserById(like.user_id);
      nft = await this.NftsService.likeNft(like.assetId, 'add');
      likesUpdated = await this.UsersService.getUserById(like.user_id);
    }
    return { likes: nft.raw[0].likes, likedUpdated: likesUpdated };
  }
}
