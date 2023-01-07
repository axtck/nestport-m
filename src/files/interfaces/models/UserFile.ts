import { Id } from 'src/types/core.types';
import { IFile } from './File';

export interface IUserFile extends IFile {
  userId: Id;
}
