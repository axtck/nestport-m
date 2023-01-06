import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigHelper, IAppConfig } from './config/config.helper';
import { connectionSource } from './orm/ormconfig';

const bootstrap = async (): Promise<void> => {
  await connectionSource.initialize();
  await connectionSource.runMigrations();

  const app: INestApplication = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig: IAppConfig = app.get(ConfigHelper).getAppConfig();

  await app.listen(appConfig.port);
  Logger.log(`Listening on port ${appConfig.port}, evironment: ${appConfig.environment}`, bootstrap.name);
};

void bootstrap();
