import { existsSync } from 'fs';
import * as path from 'path';
import { Environment } from '../environment.types';

export const getEnvPath = (folderPath: string, environment: Environment): string => {
  const filePath: string = path.resolve(`${folderPath}/${environment}.env`);

  if (!existsSync(filePath)) {
    throw new Error(`No .env file found called ${environment}.env in ${folderPath}`);
  }

  return filePath;
};
