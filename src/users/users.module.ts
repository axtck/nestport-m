import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigHelper } from 'src/config/config.helper';

@Module({
  providers: [UsersService, UsersRepository, ConfigHelper],
  imports: [DatabaseModule],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
