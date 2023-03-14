import { Module } from '@nestjs/common';
import { PhylloUserController } from './phylloUsers.controller';
import { PhylloUsersService } from './phylloUsers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhylloUser } from './phylloUser.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([PhylloUser]), UsersModule],
  controllers: [PhylloUserController],
  providers: [PhylloUsersService],
})
export class PhylloUsersModule {}
