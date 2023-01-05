import { Injectable } from '@nestjs/common';
import { ConfigHelper } from 'src/config/config.helper';
import { Database } from 'src/database/database';

@Injectable()
export class Repository {
  constructor(public readonly database: Database, public readonly configHelper: ConfigHelper) {}
}
