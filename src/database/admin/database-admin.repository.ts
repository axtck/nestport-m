import { Injectable } from '@nestjs/common';
import { IDatabaseConfig } from 'src/config/config.helper';
import { Repository } from 'src/core/repository';
import { Null, QueryString } from 'src/types/core.types';

@Injectable()
export class DatabaseAdminRepository extends Repository {
  private readonly dbConfig: IDatabaseConfig = this.configHelper.getDatabaseConfig();

  public async getSchema(): Promise<Null<{ schema_name: string }>> {
    const getSchemaQuery: QueryString = `
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name = '${this.dbConfig.schema}'
    `;

    const existingSchema: Null<{ schema_name: string }> = await this.database.queryOneOrDefault(getSchemaQuery);
    return existingSchema;
  }

  public async createSchema(): Promise<void> {
    await this.database.query(`CREATE SCHEMA ${this.dbConfig.schema} AUTHORIZATION ${this.dbConfig.user}`);
  }

  public async setSearchPath(): Promise<void> {
    await this.database.query(`ALTER DATABASE ${this.dbConfig.database} SET search_path TO ${this.dbConfig.schema}`);
  }

  public async getMigrationTable(): Promise<Null<{ table_name: string }>> {
    const getMigrationsTableQuery: QueryString = `
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = '${this.dbConfig.schema}' AND table_name = 'migrations'
    `;

    const existingTable: Null<{ table_name: string }> = await this.database.queryOneOrDefault(getMigrationsTableQuery);
    return existingTable;
  }

  public async createMigrationTable(): Promise<void> {
    const createMigrationsTableQuery: QueryString = `
      CREATE TABLE ${this.dbConfig.schema}.migrations (
        "id" int8 NOT NULL,
        "name" varchar(100) NOT NULL,
        "succeeded" bool NOT NULL,
        "created" timestamp NOT NULL,
        "executed" timestamp NOT NULL,
        CONSTRAINT migrations_pk PRIMARY KEY ("id")
      )
    `;

    await this.database.query(createMigrationsTableQuery);
  }

  public async insertMigration(parameters: unknown[]): Promise<void> {
    const insertMigrationQuery: QueryString = `
      INSERT INTO ${this.dbConfig.schema}.migrations
      ("id", "name", "succeeded", "created", "executed") 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT ("id") DO UPDATE 
      SET "succeeded" = excluded.succeeded, "executed" = excluded.executed
    `;

    await this.database.query(insertMigrationQuery, parameters);
  }

  public async getStoredMigrationIds(): Promise<Array<{ id: string }>> {
    const getStoredMigrationsQuery: QueryString = `SELECT id FROM ${this.dbConfig.schema}.migrations`;
    const storedMigrations: Array<{ id: string }> = await this.database.query(getStoredMigrationsQuery);
    return storedMigrations;
  }

  public async getFailedMigrationIds(): Promise<Array<{ id: string }>> {
    const getMigrationsQuery: QueryString = `SELECT id FROM ${this.dbConfig.schema}.migrations WHERE succeeded = FALSE`;
    const failedMigrations: Array<{ id: string }> = await this.database.query(getMigrationsQuery);
    return failedMigrations;
  }
}
