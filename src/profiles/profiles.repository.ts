import { Injectable } from '@nestjs/common';
import { Repository } from 'src/database/repository';
import { DbBoolean, Id, Null, QueryString } from 'src/types/core.types';
import { UpdateProfileDto } from './interfaces/dtos/update-profile.dto';
import { IProfile } from './interfaces/models/profile';

@Injectable()
export class ProfilesRepository extends Repository {
  public async findOneByUserId(userId: Id): Promise<Null<IProfile>> {
    const findQuery: QueryString = `
      SELECT user_id, first_name, last_name, date_of_birth, should_display_username
      FROM profiles WHERE user_id = ?
    `;
    const userDb: Null<IProfileDb> = await this.database.queryOne<IProfileDb>(findQuery, [userId]);
    return userDb ? this.toProfile(userDb) : null;
  }

  public async insertBase(userId: Id): Promise<void> {
    const createQuery: QueryString = 'INSERT INTO profiles (user_id) VALUES (?)';
    await this.database.query(createQuery, [userId]);
  }

  public async update(profile: UpdateProfileDto, userId: Id): Promise<void> {
    const createQuery: QueryString = `
      UPDATE profiles
      SET first_name = ?, last_name = ?, date_of_birth = ?, should_display_username = ? 
      WHERE user_id = ?
    `;

    await this.database.query(createQuery, [
      profile.firstName,
      profile.lastName,
      profile.dateOfBirth ? new Date(profile.dateOfBirth) : null,
      profile.shouldDisplayUsername,
      userId,
    ]);
  }

  public async remove(id: Id): Promise<void> {
    const removeQuery: QueryString = 'DELETE FROM profiles WHERE id = ?';
    await this.database.query(removeQuery, [id]);
  }

  private toProfile(profileDb: IProfileDb): IProfile {
    return {
      userId: profileDb.user_id,
      firstName: profileDb.first_name,
      lastName: profileDb.last_name,
      dateOfBirth: profileDb.date_of_birth,
      shouldDisplayUsername: !!profileDb.should_display_username,
    };
  }
}

interface IProfileDb {
  user_id: number;
  first_name: Null<string>;
  last_name: Null<string>;
  date_of_birth: Null<Date>;
  should_display_username: DbBoolean;
}
