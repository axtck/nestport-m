import { Id, Null } from 'src/types/core.types';

export interface IProfile {
  userId: Id;
  firstName: Null<string>;
  lastName: Null<string>;
  dateOfBirth: Null<Date>;
  shouldDisplayUsername: boolean;
}
