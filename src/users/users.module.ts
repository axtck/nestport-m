import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigHelper } from 'src/config/config.helper';
import { UserImagesService } from './user-images.service';
import { UserImagesRepository } from './user-images.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UsersService, UserImagesService, UsersRepository, UserImagesRepository, ConfigHelper],
  controllers: [UsersController],
  exports: [UsersService, UserImagesService],
})
export class UsersModule {}
