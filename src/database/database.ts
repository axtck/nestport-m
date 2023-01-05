import { Injectable } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';
import { ConfigHelper } from 'src/config/config.helper';
import { Null, QueryString } from 'src/types/core.types';

@Injectable()
export class Database {
  private readonly connection: Pool;

  constructor(configHelper: ConfigHelper) {
    this.connection = new Pool({ ...configHelper.getDatabaseConfig() });
  }

  public async query<T extends QueryResultRow>(sql: QueryString, parameters?: unknown[]): Promise<T[]> {
    const result: QueryResult<T> = await this.connection.query<T>(sql, parameters);
    return result.rows;
  }

  public async queryOne<T extends QueryResultRow>(sql: QueryString, parameters?: unknown[]): Promise<T> {
    const result: T[] = await this.query<T>(sql, parameters);

    if (!result || !result.length) throw new Error('query did not return any rows');
    if (result.length < 1) throw new Error('more than one row for query');

    return result[0];
  }

  public queryOneOrDefault = async <T extends QueryResultRow>(
    sql: QueryString,
    parameters?: unknown[],
  ): Promise<Null<T>> => {
    const result: T[] = await this.query<T>(sql, parameters);

    if (!result || !result.length) return null;
    if (result.length < 1) throw new Error('more than one row for query');

    return result[0];
  };
}
