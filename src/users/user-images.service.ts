import { Injectable } from '@nestjs/common';
import { Id } from 'src/types/core.types';
import { UserImagesRepository } from './user-images.repository';

@Injectable()
export class UserImagesService {
  constructor(private readonly repository: UserImagesRepository) {}

  public async create(userId: Id, filePath: string): Promise<void> {
    const isActive = true; // TODO: when uploading a new profile picture, set others inactive (discuss)
    await this.repository.create(userId, filePath, isActive);
  }

  public async remove(userId: Id): Promise<void> {
    await this.repository.remove(userId);
  }
}
