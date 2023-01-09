import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserImagesProfile1673087034941 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE user_images_profile(
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        file_path VARCHAR(200) NOT NULL,
        is_active BOOL NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        modified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(_queryRunner: QueryRunner): Promise<void> {
    throw new Error('This migration should not be reverted');
  }
}
