import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProfilesController } from './profiles.controller';
import { ProfilesRepository } from './profiles.repository';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesRepository],
})
export class ProfilesModule {}
