import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10) || 5432,
  database: process.env.DB_DB,
  schema: process.env.DB_SCHEMA,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}));
