import { Module } from '@nestjs/common';
import { ConfigHelper } from 'src/config/config.helper';
import { Repository } from 'typeorm';
import { Database } from './database';

@Module({
  providers: [Database, Repository, ConfigHelper],
  exports: [Database],
})
export class DatabaseModule {}
