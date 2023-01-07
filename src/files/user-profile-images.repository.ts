import { Injectable } from '@nestjs/common';
import { Repository } from 'src/database/repository';
import { DbBoolean, Id, QueryString } from 'src/types/core.types';
import { IUserProfileImage } from './interfaces/models/UserProfileImage';

@Injectable()
export class UserProfileImagesRepository extends Repository {
  public async findAllProfileImagesByUserId(userId: Id): Promise<IUserProfileImage[]> {
    const findQuery: QueryString = `
      SELECT id, user_id, file_path, is_active
      FROM user_images_profile where user_id = ?
    `;
    const userDbs: IUserProfileImageDb[] = await this.database.query(findQuery, [userId]);
    return userDbs.map(this.toUserProfileImage);
  }

  public async create(userId: Id, filePath: string, isActive: boolean): Promise<void> {
    const createQuery: QueryString = 'INSERT INTO user_images_profile (user_id, file_path, is_active) VALUES (?, ?, ?)';
    await this.database.query(createQuery, [userId, filePath, isActive]);
  }

  public async remove(id: Id): Promise<void> {
    const removeQuery: QueryString = 'DELETE FROM user_images_profile WHERE id = ?';
    await this.database.query(removeQuery, [id]);
  }

  private toUserProfileImage(userProfileImageDb: IUserProfileImageDb): IUserProfileImage {
    return {
      id: userProfileImageDb.id,
      userId: userProfileImageDb.user_id,
      filePath: userProfileImageDb.file_path,
      isActive: !!userProfileImageDb.is_active,
    };
  }
}

interface IUserProfileImageDb {
  id: number;
  user_id: number;
  file_path: string;
  is_active: DbBoolean;
}
