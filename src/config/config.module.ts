import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Environment } from 'src/common/environment.types';
import { getEnvPath } from 'src/common/helpers/environment.helper';
import { isEnumValue } from 'src/types/guards/enums';
import { appConfig } from './app.config';
import { databaseConfig } from './database.config';
import * as Joi from 'joi';
import * as path from 'path';
import { authConfig } from './auth.config';
import { ConfigHelper } from './config.helper';

const environment: string | undefined = process.env.SERVER_ENV;
if (!isEnumValue<Environment>(environment, Object.values(Environment))) {
  throw new Error(
    `Environment '${environment}' not valid, run ${Object.values(Environment)
      .map((e) => `'export SERVER_ENV=${e}'`)
      .join(' OR ')} on host machine`,
  );
}

const envFilePath: string = getEnvPath(path.join('src', 'common', 'environments'), environment);
const validationSchema = Joi.object({
  // app
  SERVER_ENV: Joi.valid(...Object.values(Environment)).required(),
  SERVER_PORT: Joi.number().required(),

  // database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_DB: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),

  // auth
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.number().required(),
  SALT_ROUNDS: Joi.number().required(),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig],
      validationSchema: validationSchema,
    }),
  ],
  providers: [ConfigHelper],
  exports: [ConfigHelper],
})
export class ConfigModule {}
