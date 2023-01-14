import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Id } from 'src/types/core.types';
import { IUser } from 'src/users/interfaces/models/user';
import { IProfile } from './interfaces/models/profile';
import { ProfilesRepository } from './profiles.repository';

@Injectable()
export class ProfilesService {
  constructor(private readonly repository: ProfilesRepository) {}
  @OnEvent('user.created')
  public async addProfile(createdUser: IUser): Promise<void> {
    await this.repository.insertBase(createdUser.id);
  }

  public async findOneByUserId(userId: Id): Promise<IProfile> {
    const profile = await this.repository.findOneByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    return profile;
  }
}
