import * as crypto from 'crypto';

export const generateUniqueIdentifier = (): string => {
  return `${new Date().getTime()}-${crypto.randomBytes(16).toString('hex')}`;
};
