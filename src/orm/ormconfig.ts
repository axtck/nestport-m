import { DataSource } from 'typeorm';

export const connectionSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: 'admin',
  database: 'dev',
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  synchronize: true,
});
