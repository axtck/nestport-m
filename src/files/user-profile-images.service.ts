import { Injectable } from '@nestjs/common';
import { Id, Null } from 'src/types/core.types';
import { IUserProfileImage } from './interfaces/models/UserProfileImage';
import { UserProfileImagesRepository } from './user-profile-images.repository';

@Injectable()
export class UserProfileImagesService {
  constructor(private readonly repository: UserProfileImagesRepository) {}

  public async findAllByUserId(userId: Id): Promise<IUserProfileImage[]> {
    return this.repository.findAllProfileImagesByUserId(userId);
  }

  public async findOne(userId: Id): Promise<IUserProfileImage> {
    const image: Null<IUserProfileImage> = await this.repository.findOne(userId);
    if (!image) throw new Error('Image not found');
    return image;
  }

  public async create(userId: Id, filePath: string): Promise<void> {
    const isActive = true; // TODO: when uploading a new profile picture, set others inactive (discuss)
    await this.repository.create(userId, filePath, isActive);
  }

  public async remove(userId: Id): Promise<void> {
    await this.repository.remove(userId);
  }
}
