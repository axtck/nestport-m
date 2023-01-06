import { Module } from '@nestjs/common';
import { Database } from './database';
import { ConfigHelper } from 'src/config/config.helper';

@Module({
  providers: [Database, ConfigHelper],
  exports: [Database],
})
export class DatabaseModule {}
