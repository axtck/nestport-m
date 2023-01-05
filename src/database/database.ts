import { Injectable } from '@nestjs/common';
import { createPool, Pool } from 'mysql2/promise';
import { ConfigHelper } from 'src/config/config.helper';
import { Null, QueryString } from 'src/types/core.types';

@Injectable()
export class Database {
  private readonly pool: Pool;

  constructor(configHelper: ConfigHelper) {
    this.pool = createPool({ ...configHelper.getDatabaseConfig() });
  }

  public async query<T>(sql: QueryString, parameters?: unknown[]): Promise<T[]> {
    const [rows] = await this.pool.query(sql, parameters);
    return rows as T[];
  }

  public queryOne = async <T>(sql: QueryString, parameters?: unknown[]): Promise<Null<T>> => {
    const result: T[] = await this.query<T>(sql, parameters);

    if (!result?.length) return null;
    if (result.length < 1) throw new Error('more than one row for query');

    return result[0];
  };
}
