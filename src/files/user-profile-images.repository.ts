import { Injectable } from '@nestjs/common';
import { Repository } from 'src/database/repository';
import { DbBoolean, Id, Null, QueryString } from 'src/types/core.types';
import { IUserProfileImage } from './interfaces/models/UserProfileImage';

@Injectable()
export class UserProfileImagesRepository extends Repository {
  public async findAllProfileImagesByUserId(userId: Id): Promise<IUserProfileImage[]> {
    const findQuery: QueryString = `
      SELECT id, user_id, file_path, is_active
      FROM user_images_profile where user_id = ?
    `;
    const userProfileImageDbs: IUserProfileImageDb[] = await this.database.query(findQuery, [userId]);
    return userProfileImageDbs.map(this.toUserProfileImage);
  }

  public async findOne(id: Id): Promise<Null<IUserProfileImage>> {
    const findQuery: QueryString = `
      SELECT id, user_id, file_path, is_active
      FROM user_images_profile where id = ?
    `;
    const userProfileImageDb: Null<IUserProfileImageDb> = await this.database.queryOne(findQuery, [id]);
    return userProfileImageDb ? this.toUserProfileImage(userProfileImageDb) : null;
  }

  public async activateOneById(id: Id): Promise<void> {
    const deactivateQuery: QueryString = 'UPDATE user_images_profile SET is_active = TRUE WHERE id = ?';
    await this.database.query(deactivateQuery, [id]);
  }

  public async deactivateAllByUserId(userId: Id): Promise<void> {
    const deactivateQuery: QueryString = 'UPDATE user_images_profile SET is_active = FALSE WHERE user_id = ?';
    await this.database.query(deactivateQuery, [userId]);
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
