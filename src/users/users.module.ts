import { Module } from '@nestjs/common';
import { ConfigHelper } from 'src/config/config.helper';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, UsersRepository, ConfigHelper],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
