import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readdir } from 'fs/promises';
import * as path from 'path';
import { ConfigHelper, IDatabaseConfig } from 'src/config/config.helper';
import { DateService } from 'src/core/dates.service';
import { Null } from 'src/types/core.types';
import { Database } from '../database';
import { DatabaseAdminRepository } from './database-admin.repository';

@Injectable()
export class DatabaseAdmin {
  constructor(
    private readonly database: Database,
    private readonly logger: Logger,
    private readonly databaseAdminRepository: DatabaseAdminRepository,
    private readonly dateService: DateService,
    private readonly configHelper: ConfigHelper,
    private readonly configService: ConfigService,
  ) {}

  private readonly dbConfig: IDatabaseConfig = this.configHelper.getDatabaseConfig();

  public async setSchema(): Promise<void> {
    const existingSchema: Null<{ schema_name: string }> = await this.databaseAdminRepository.getSchema();
    if (existingSchema) return;

    await this.databaseAdminRepository.createSchema();
    await this.databaseAdminRepository.setSearchPath();
  }

  public async runMigrations(migrationsFolderPath: string): Promise<void> {
    try {
      // create migrations table
      await this.createMigrationsTable();

      let files: string[];
      try {
        // get migrations
        files = await readdir(migrationsFolderPath);
      } catch {
        this.logger.error('reading migrations folder failed', DatabaseAdmin.name);
        return;
      }
      const compiledMigrationFiles: string[] = files.filter((f) => f.split('.')[f.split('.').length - 1] === 'js');
      const migrationsToRun: string[] = await this.getMigrationsToRun(compiledMigrationFiles);
      if (!migrationsToRun || !migrationsToRun.length) {
        this.logger.log('no migrations to run', DatabaseAdmin.name);
        return;
      }

      // sort based on timestamp (chronological order)
      const sortedMigrationsToRun: string[] = migrationsToRun.sort((a, b) => {
        return +this.convertFilename(a).id - +this.convertFilename(b).id;
      });
      this.logger.log(
        `migrations to run (in order): ${migrationsToRun.map((m) => this.convertFilename(m).id).join(', ')}`,
        DatabaseAdmin.name,
      );

      // upgrade all migrations to run
      for (const file of sortedMigrationsToRun) {
        const migration: IMigrationFile = await import(path.join(migrationsFolderPath, file)); // import migration
        const migrationFileInfo: IMigrationFileInfo = this.convertFilename(file); // extract file info

        try {
          if (!migration.upgrade) throw new Error(`migration ${file} doesn't have an upgrade function`);
          this.logger.log(
            `upgrading: migration ${migrationFileInfo.id} (${migrationFileInfo.name})`,
            DatabaseAdmin.name,
          );
          await migration.upgrade(this.database, this.configService);
          this.logger.log(`migration ${migrationFileInfo.id} successfully upgraded`, DatabaseAdmin.name);
          await this.insertOrUpdateMigration(migrationFileInfo, true);
        } catch (e) {
          this.logger.error(`migration ${migrationFileInfo.id} upgrading failed: ${e}`, DatabaseAdmin.name);
          await this.insertOrUpdateMigration(migrationFileInfo, false);
        }
      }
    } catch (e) {
      this.logger.error(`upgrading database failed: ${e}`, DatabaseAdmin.name);
    }
  }

  private async createMigrationsTable(): Promise<void> {
    const existingTable: Null<{ table_name: string }> = await this.databaseAdminRepository.getMigrationTable();

    if (existingTable) {
      this.logger.log('migrations table not created (exists)', DatabaseAdmin.name);
      return;
    }

    await this.databaseAdminRepository.createMigrationTable();
    this.logger.log('successfully created migrations table', DatabaseAdmin.name);
  }

  private async insertOrUpdateMigration(migrationFileInfo: IMigrationFileInfo, succeeded: boolean): Promise<void> {
    const parameters: unknown[] = [
      migrationFileInfo.id, // id
      migrationFileInfo.name, // name
      succeeded, // succeeded
      this.dateService.getByUnixTimestamp(+migrationFileInfo.id), // created
      this.dateService.getNow(), // executed
    ];

    await this.databaseAdminRepository.insertMigration(parameters);
  }

  private async getMigrationsToRun(migrationFiles: string[]): Promise<string[]> {
    const storedMigrationIds: Array<{ id: string }> = await this.databaseAdminRepository.getStoredMigrationIds();
    const failedMigrationIds: Array<{ id: string }> = await this.databaseAdminRepository.getFailedMigrationIds();

    // filter out new migrations
    const newMigrations: string[] = migrationFiles.filter((m) => {
      return !storedMigrationIds.map((m) => m.id).includes(this.convertFilename(m).id);
    });

    // filter out failed migrations
    const failedMigrations: string[] = migrationFiles.filter((m) => {
      return failedMigrationIds.map((m) => m.id).includes(this.convertFilename(m).id);
    });

    const migrationsToRun: string[] = [...newMigrations, ...failedMigrations]; // concat new and failed migrations
    return migrationsToRun;
  }

  private convertFilename(filename: string): IMigrationFileInfo {
    const parts = filename
      .slice(0, -3)
      .split(/_(.+)/)
      .filter((x) => x); // slice of extention and split on first _

    if (!parts || parts.length !== 2) {
      throw new Error(`converting filename '${filename}' failed`);
    }

    const info: IMigrationFileInfo = {
      id: parts[0],
      name: parts[1],
    };

    return info;
  }
}

interface IMigrationFile {
  upgrade: (database: Database, configService?: ConfigService) => Promise<void>;
}

interface IMigrationFileInfo {
  id: string;
  name: string;
}
