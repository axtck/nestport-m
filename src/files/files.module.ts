import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { FilesController } from './files.controller';
import { UserProfileImagesRepository } from './user-profile-images.repository';
import { UserProfileImagesService } from './user-profile-images.service';

@Module({
  imports: [DatabaseModule],
  providers: [UserProfileImagesService, UserProfileImagesRepository],
  controllers: [FilesController],
})
export class FilesModule {}
