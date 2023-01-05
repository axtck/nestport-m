import { Id } from 'src/types/core.types';
import { IUserIdentifier } from './user-identifier.interface';

export interface IJwtTokenSignature extends Omit<IUserIdentifier, 'id'> {
  sub: Id;
}
