import { Injectable } from '@nestjs/common';
import { Repository } from 'src/database/repository';
import { Id, Null, QueryString } from 'src/types/core.types';
import { IProfile } from './interfaces/models/profile';

@Injectable()
export class ProfilesRepository extends Repository {
  public async findOneByUserId(userId: Id): Promise<Null<IProfile>> {
    const findQuery: QueryString = `
      SELECT id, user_id, first_name, last_name, date_of_birth
      FROM profiles WHERE user_id = ?
    `;
    const userDb: Null<IProfileDb> = await this.database.queryOne<IProfileDb>(findQuery, [userId]);
    return userDb ? this.toProfile(userDb) : null;
  }

  public async insertBase(userId: Id): Promise<void> {
    const createQuery: QueryString = 'INSERT INTO profiles (user_id) VALUES (?)';
    await this.database.query(createQuery, [userId]);
  }

  public async remove(id: Id): Promise<void> {
    const removeQuery: QueryString = 'DELETE FROM profiles WHERE id = ?';
    await this.database.query(removeQuery, [id]);
  }

  private toProfile(profileDb: IProfileDb): IProfile {
    return {
      id: profileDb.id,
      userId: profileDb.user_id,
      firstName: profileDb.first_name,
      lastName: profileDb.last_name,
      dateOfBirth: profileDb.date_of_birth,
    };
  }
}

interface IProfileDb {
  id: number;
  user_id: number;
  first_name: Null<string>;
  last_name: Null<string>;
  date_of_birth: Null<Date>;
}
