import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthUserDTAO } from '../users/dto/auth-user.dto';
import { User } from '../users/users.entity';

import Web3 from 'web3';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUser(username);
    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }
  /**
   *
   * @param user
   */
  async login(userDTO: AuthUserDTAO) {
    const web3 = new Web3();
    const auth_user: User = await this.validateUser(
      userDTO.address,
      userDTO.signature,
    );
    if (auth_user) {
      const userAddress: string = web3.eth.accounts.recover(
        auth_user.nonce,
        userDTO.signature,
      );

      this.logger.log(
        'Verifier address: ' +
          userAddress +
          ' sent address: ' +
          userDTO.address,
      );
      this.logger.log('User login DTO address: ' + auth_user);

      if (
        userAddress.toLocaleLowerCase() == userDTO.address.toLocaleLowerCase()
      ) {
        const payload = { username: userDTO.address, sub: auth_user.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      } else {
        throw new BadRequestException('Invalid signature or username');
      }
    } else {
      throw new BadRequestException('User not exists');
    }
  }

  async adminLogin(userDTO: AuthUserDTAO) {
    const web3 = new Web3();
    const auth_user: User = await this.validateUser(
      userDTO.address,
      userDTO.signature,
    );
    if (auth_user) {
      const userAddress: string = web3.eth.accounts.recover(
        auth_user.nonce,
        userDTO.signature,
      );

      this.logger.log(
        'Verifier address: ' +
          userAddress +
          ' sent address: ' +
          userDTO.address,
      );
      this.logger.log('User login DTO address: ' + auth_user);

      if (
        userAddress.toLocaleLowerCase() == userDTO.address.toLocaleLowerCase()
      ) {
        if (this.isAdminAddress(userAddress)) {
          const payload = { username: userDTO.address, sub: auth_user.id };
          return {
            access_token: this.jwtService.sign(payload),
          };
        } else {
          throw new BadRequestException('User is not admin');
        }
      } else {
        throw new BadRequestException('Invalid signature or username');
      }
    } else {
      throw new BadRequestException('User not exists');
    }
  }

  verifyAdmin(token: string) {
    console.log('token', token);
    if (token != null && token.startsWith('Bearer ')) {
      token = token.substring(7, token.length);
    }
    try {
      const decodedJwtAccessToken = this.jwtService.decode(token);
      if (decodedJwtAccessToken) {
        const userName = decodedJwtAccessToken['username'];
        console.log('decodedJwtAccessToken', userName);
        const isAdmin = this.isAdminAddress(userName);
        console.log('isAdmin', isAdmin);
        return isAdmin;
      }
    } catch (err) {
      console.log('err', err);
    }
    return false;
  }

  isAdminAddress(address: string) {
    const alltoken = process.env.ADMIN_ADDRESS_LIST;
    const splitted = alltoken.split(',');
    const result = splitted.find((element) => {
      return element.toLocaleLowerCase() === address.toLocaleLowerCase();
    });
    return !!result;
  }
}
