import { Module } from '@nestjs/common';
import { Database } from './database';
import { ConfigHelper } from 'src/config/config.helper';
import { Repository } from 'typeorm';

@Module({
  providers: [Database, Repository, ConfigHelper],
  exports: [Database],
})
export class DatabaseModule {}
