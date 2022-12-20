import { Injectable } from '@nestjs/common';
import { Comment } from './comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { User } from 'src/users/users.entity';
import { Nft } from 'src/nfts/nft.entity';
import { Challenge } from 'src/nft-challenge/challenges/challenge.entity';
import { AddCommentDTO } from './dto/addCommentDTO';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async addComment(addCommentDTO: AddCommentDTO): Promise<any> {
    const comment = new Comment();

    if (addCommentDTO.nft) {
      const nft = new Nft();
      nft.id = addCommentDTO.nft;
      comment.nft = nft;
    }
    if (addCommentDTO.challenge) {
      const challenge = new Challenge();
      challenge.id = addCommentDTO.challenge;
      comment.challenge = challenge;
    }
    const user = new User();
    user.id = addCommentDTO.user;
    comment.user = user;

    comment.comment = addCommentDTO.comment;
    comment.liked = addCommentDTO.liked;

    return this.commentsRepository.save(comment);
  }
  async getCommentByNFT(nftId, userId): Promise<any> {
    const result = await this.commentsRepository
      .createQueryBuilder('Comment')
      .leftJoinAndSelect('Comment.nft', 'nft')
      .leftJoinAndSelect('Comment.user', 'user')
      .leftJoinAndSelect('Comment.commentLike', 'commentLike')
      .leftJoinAndSelect('commentLike.user', 'commentLikeUser')
      .where('nft.id = :id', { id: nftId })
      .orderBy('Comment.createdAt', 'ASC')
      .getMany();

    for (let i = 0; i < result.length; i++) {
      if (result[i].commentLike) {
        for (let j = 0; j < result[i].commentLike.length; j++) {
          if (result[i].commentLike[j].user.id == userId) {
            result[i].liked = true;
          }
        }
      }
    }
    return result;
  }
  async getCommentByChallenge(challengeId, userId): Promise<any> {
    const result = await this.commentsRepository
      .createQueryBuilder('Comment')
      .leftJoinAndSelect('Comment.challenge', 'challenge')
      .leftJoinAndSelect('Comment.user', 'user')
      .leftJoinAndSelect('Comment.commentLike', 'commentLike')
      .leftJoinAndSelect('commentLike.user', 'commentLikeUser')
      .where('challenge.id = :id', { id: challengeId })
      .orderBy('Comment.createdAt', 'ASC')
      .getMany();

    for (let i = 0; i < result.length; i++) {
      if (result[i].commentLike) {
        for (let j = 0; j < result[i].commentLike.length; j++) {
          if (result[i].commentLike[j].user.id == userId) {
            result[i].liked = true;
          }
        }
      }
    }
    return result;
  }

  getCommentStat(startDate, endDate) {
    const _startDate = startDate ? new Date(startDate) : null;
    const _endDate = endDate ? new Date(endDate) : null;

    const query = `SELECT  d.ref_date :: date AS "date"
    , count(id) AS "count" FROM generate_series('${_startDate.toLocaleDateString()}' :: timestamp, '${_endDate.toLocaleDateString()}' :: timestamp, '1 day') AS d(ref_date)
    LEFT JOIN "comment"
    ON date_trunc('day', d.ref_date) = date_trunc('day', "comment"."createdAt")
    GROUP BY d.ref_date ORDER BY d.ref_date ASC`;
    return this.connection.query(query);
  }

  getNumberOfComment(startDate: string, endDate: string): Promise<any> {
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
    return this.commentsRepository.count({
      where,
    });
  }
}
