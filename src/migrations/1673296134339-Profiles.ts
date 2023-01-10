import { MigrationInterface, QueryRunner } from 'typeorm';

export class Profiles1673296134339 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE profiles (
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        first_name varchar (30) NULL,
        last_name varchar (30) NULL,
        date_of_birth DATE NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        modified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(_queryRunner: QueryRunner): Promise<void> {
    throw new Error('This migration should not be reverted');
  }
}
