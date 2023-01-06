import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigHelper } from 'src/config/config.helper';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, UsersRepository, ConfigHelper],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
