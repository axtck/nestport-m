import { ConfigService } from '@nestjs/config';
import { Database } from '../database';

export const upgrade = async (database: Database, configService: ConfigService): Promise<void> => {
  const dbSchema: string = configService.get<string>('database.schema') as string;

  await database.query(`
    CREATE TABLE ${dbSchema}.users (
      "id" serial4 NOT NULL,
      "username" varchar(50) NOT NULL,
      "email" varchar(100) NOT NULL,
      "password" varchar(100) NOT NULL,
      CONSTRAINT "users_pk" PRIMARY KEY ("id"),
      CONSTRAINT "users_username_un" UNIQUE ("username"),
      CONSTRAINT "users_email_un" UNIQUE ("email")
    )
  `);

  await database.query(`
    CREATE TABLE ${dbSchema}.roles (
      "id" int4 NOT NULL,
      "name" varchar(20) NOT NULL,
      CONSTRAINT "roles_pk" PRIMARY KEY ("id"),
      CONSTRAINT "roles_un" UNIQUE ("name")
    )
  `);

  await database.query(`
    CREATE TABLE ${dbSchema}.user_roles (
      "id" serial4 NOT NULL,
      "user_id" int4 NOT NULL,
      "role_id" int4 NOT NULL,
      CONSTRAINT "user_roles_pk" PRIMARY KEY ("id"),
      CONSTRAINT "user_roles_user_fk" FOREIGN KEY ("user_id") REFERENCES ${dbSchema}.users ("id"),
      CONSTRAINT "user_roles_role_fk" FOREIGN KEY ("role_id") REFERENCES ${dbSchema}.roles ("id")
    )
  `);

  await database.query(`
    INSERT INTO ${dbSchema}.roles ("id", "name")
    VALUES (1, 'user'), (2, 'admin'), (3, 'moderator')
  `);
};
