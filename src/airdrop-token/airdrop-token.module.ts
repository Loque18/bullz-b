import { Module } from '@nestjs/common';
import { AirdropTokenController } from './airdrop-token.controller';
import { AirdropTokenService } from './airdrop-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirdropToken } from './airdrop_token.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([AirdropToken]), AuthModule],
  controllers: [AirdropTokenController],
  providers: [AirdropTokenService],
})
export class AirdropTokenModule {}
