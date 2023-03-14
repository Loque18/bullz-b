import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PhylloUser } from './phylloUser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { CreatePhylloUserDTO } from './dto/create-phylloUser.dto';
import { UpdatePhylloUserDTO } from './dto/update-phylloUser.dto';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { CreateTokenDTO } from './dto/create-token.dto';
const URL_CREATE_USER_TOKEN = '/v1/sdk-tokens';
const URL_CREATE_USER = '/v1/users';
const URL_USER_PROFILE = '/v1/profiles';

@Injectable()
export class PhylloUsersService {
  axiosInstance = null;
  constructor(
    @InjectRepository(PhylloUser)
    private phylloUsersRepository: Repository<PhylloUser>,
    private userService: UsersService,
  ) {
    this.axiosInstance = axios.create({
      baseURL: process.env.PHYLLO_BASE_URL,
      auth: {
        username: process.env.PHYLLO_CLIENT_ID,
        password: process.env.PHYLLO_SECRET_ID,
      },
    });
  }

  async createUser(name: string, externalId: number) {
    try {
      const response = await this.axiosInstance.post(URL_CREATE_USER, {
        name: name,
        external_id: externalId,
      });
      return response?.data['id'];
    } catch (err) {
      console.error(`Error ${err} occurred while generating user token`);
      return null;
    }
  }

  async createUserToken(userId: string) {
    try {
      const response = await this.axiosInstance.post(URL_CREATE_USER_TOKEN, {
        user_id: userId,
        products: ['IDENTITY'],
      });
      return response.data['sdk_token'];
    } catch (err) {
      console.error(`Error ${err} occurred while generating user token`);
      return null;
    }
  }

  async getUserProfile(accountId: string) {
    console.log('accountId', accountId);
    try {
      const response = await this.axiosInstance.get(
        `${URL_USER_PROFILE}?account_id=${accountId}`,
      );
      return response.data['data'];
    } catch (err) {
      console.error(`Error ${err} occurred while generating user token`);
      throw new HttpException(err.body, HttpStatus.NOT_FOUND);
    }
  }

  async createToken(createTokenDTO: CreateTokenDTO): Promise<any> {
    const existingPhylloUser = await this.getUser(
      createTokenDTO.user_id,
      createTokenDTO.platform_id,
    );

    if (existingPhylloUser) {
      const token = await this.createUserToken(
        existingPhylloUser.phyllo_user_id,
      );
      if (!token) {
        throw new HttpException(
          'token can not be created',
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log('token', token);
      existingPhylloUser.token = token;
      delete existingPhylloUser.createdAt;
      delete existingPhylloUser.updatedAt;
      await this.update(existingPhylloUser);
      return existingPhylloUser;
    } else {
      const user = await this.userService.find(createTokenDTO.user_id);
      if (!user) {
        throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
      }
      const userId = await this.createUser(user.username, new Date().getTime());
      if (!userId) {
        throw new HttpException(
          'Userid can not be created',
          HttpStatus.BAD_REQUEST,
        );
      }
      const token = await this.createUserToken(userId);
      if (!token) {
        throw new HttpException(
          'token can not be created',
          HttpStatus.BAD_REQUEST,
        );
      }

      const phylloUser = new CreatePhylloUserDTO();
      phylloUser.user_id = user.id;
      phylloUser.phyllo_user_id = userId;
      phylloUser.token = token;
      phylloUser.platform_id = createTokenDTO.platform_id;

      const insertData = await this.phylloUsersRepository.save(phylloUser);
      return insertData;
    }
  }

  getUser(user_id: string, platform_id: string): Promise<any> {
    return this.phylloUsersRepository
      .createQueryBuilder('PhylloUser')
      .where('PhylloUser.user_id = :user_id', { user_id: user_id })
      .andWhere('PhylloUser.platform_id = :platform_id', {
        platform_id: platform_id,
      })
      .getOne();
  }

  update(phylloUser: UpdatePhylloUserDTO): Promise<any> {
    return this.phylloUsersRepository.update(phylloUser.id, phylloUser);
  }

  // remove(id: string): Promise<DeleteResult> {
  //   return this.phylloUsersRepository.delete(id);
  // }
}
