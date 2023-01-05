import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10) || 3307,
  database: process.env.DB_DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}));
