import { Id, Null } from 'src/types/core.types';

export interface IProfile {
  id: Id;
  userId: Id;
  firstName: Null<string>;
  lastName: Null<string>;
  dateOfBirth: Null<Date>;
  avatarColor: string;
}
