import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  environment: process.env.SERVER_ENV,
  port: parseInt(process.env.SERVER_PORT as string, 10) || 3002,
}));
