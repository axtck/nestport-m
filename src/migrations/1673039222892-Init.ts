import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1673039222892 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY (username),
        UNIQUE KEY (email)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE roles (
        id INT NOT NULL,
        name VARCHAR(20) NOT NULL,
        PRIMARY KEY (id)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE user_roles (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (role_id) REFERENCES roles (id)
      )
    `);

    await queryRunner.query(`
      INSERT INTO roles (id, name)
      VALUES (1, 'user'), (2, 'admin'), (3, 'moderator')
    `);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(_queryRunner: QueryRunner): Promise<void> {
    throw new Error('This migration should not be reverted');
  }
}
