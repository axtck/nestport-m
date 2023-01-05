import { Logger, Module } from '@nestjs/common';
import { Database } from './database';
import { ConfigHelper } from 'src/config/config.helper';
import { DateService } from 'src/core/dates.service';

@Module({
  providers: [Database, Logger, ConfigHelper, DateService],
  exports: [Database],
})
export class DatabaseModule {}
