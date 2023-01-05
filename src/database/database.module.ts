import { Logger, Module } from '@nestjs/common';
import { Database } from './database';
import { DatabaseAdmin } from './admin/database-admin';
import { ConfigHelper } from 'src/config/config.helper';
import { DatabaseAdminRepository } from './admin/database-admin.repository';
import { DateService } from 'src/core/dates.service';

@Module({
  providers: [Database, DatabaseAdmin, Logger, ConfigHelper, DatabaseAdminRepository, DateService],
  exports: [Database, DatabaseAdmin],
})
export class DatabaseModule {}
