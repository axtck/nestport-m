import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from 'src/common/environment.types';

@Injectable()
export class ConfigHelper {
  constructor(private readonly configService: ConfigService) {}

  public getAppConfig(): IAppConfig {
    const config: IAppConfig = {
      environment: this.configService.get<Environment>('app.environment') as Environment,
      port: this.configService.get<number>('app.port') as number,
    };

    this.ensureValid(config);
    return config;
  }

  public getDatabaseConfig(): IDatabaseConfig {
    const config: IDatabaseConfig = {
      host: this.configService.get<string>('database.host') as string,
      port: this.configService.get<number>('database.port') as number,
      database: this.configService.get<string>('database.database') as string,
      schema: this.configService.get<string>('database.schema') as string,
      user: this.configService.get<string>('database.user') as string,
      password: this.configService.get<string>('database.password') as string,
    };

    this.ensureValid(config);
    return config;
  }

  public getAuthConfig(): IAuthConfig {
    const config: IAuthConfig = {
      jwtSecret: this.configService.get<string>('auth.jwtSecret') as string,
      jwtExpiry: this.configService.get<number>('auth.jwtExpiry') as number,
      saltRounds: this.configService.get<number>('auth.saltRounds') as number,
    };

    this.ensureValid(config);
    return config;
  }

  private ensureValid(config: Config): void {
    for (const [k, v] of Object.entries(config)) {
      if (!v) throw new Error(`${k} env variable is not correctly accessed`);
    }
  }
}

type Config = IAppConfig | IDatabaseConfig | IAuthConfig;

export interface IAppConfig {
  environment: Environment;
  port: number;
}

export interface IDatabaseConfig {
  host: string;
  port: number;
  database: string;
  schema: string;
  user: string;
  password: string;
}

export interface IAuthConfig {
  jwtSecret: string;
  jwtExpiry: number;
  saltRounds: number;
}
