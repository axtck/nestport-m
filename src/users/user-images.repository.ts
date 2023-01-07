import { Injectable } from '@nestjs/common';
import { Repository } from 'src/database/repository';
import { Id, QueryString } from 'src/types/core.types';

@Injectable()
export class UserImagesRepository extends Repository {
  public async create(userId: Id, filePath: string, isActive: boolean): Promise<void> {
    const createQuery: QueryString = 'INSERT INTO user_images_profile (user_id, file_path, is_active) VALUES (?, ?, ?)';
    await this.database.query(createQuery, [userId, filePath, isActive]);
  }

  public async remove(id: Id): Promise<void> {
    const removeQuery: QueryString = 'DELETE FROM user_images_profile WHERE id = ?';
    await this.database.query(removeQuery, [id]);
  }
}
