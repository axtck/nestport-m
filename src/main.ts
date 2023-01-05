import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AppModule } from './app.module';
import { ConfigHelper, IAppConfig } from './config/config.helper';
import { DatabaseAdmin } from './database/admin/database-admin';

const bootstrap = async (): Promise<void> => {
  const app: INestApplication = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig: IAppConfig = app.get(ConfigHelper).getAppConfig();
  const databaseAdmin: DatabaseAdmin = app.get(DatabaseAdmin);

  await databaseAdmin.setSchema();

  // at runtime, this will point to dist/migrations
  const migrationsFolderPath: string = path.join(__dirname, 'database', 'migrations');
  await databaseAdmin.runMigrations(migrationsFolderPath);

  await app.listen(appConfig.port);

  Logger.log(`Listening on port ${appConfig.port}, evironment: ${appConfig.environment}`, bootstrap.name);
};

void bootstrap();
