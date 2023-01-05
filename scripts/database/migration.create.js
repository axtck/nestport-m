const { writeFileSync } = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const minimist = require('minimist');

const migrationFileContent = `import { ConfigService } from '@nestjs/config';
import { Database } from '../database';

export const upgrade = async (database: Database, configService: ConfigService): Promise<void> => {
  await database.query('SELECT 1');
};
`;

const create = async () => {
  try {
    // create migrations folder if it doesn't exist
    const migrationsFolder = path.join('src', 'database', 'migrations');
    await mkdirp(migrationsFolder);

    // create migration name
    const parsedArgv = parseArgv();
    const migrationName = createFileName(parsedArgv.name);

    // write migration
    const migrationPath = path.join(migrationsFolder, migrationName);
    writeFileSync(migrationPath, migrationFileContent);
    console.log('successfully created migration');
    console.log(migrationPath);
  } catch (e) {
    console.log(`creating migration failed: ${e}`);
  }
};

const parseArgv = () => {
  const args = minimist(process.argv.slice(2), {
    string: 'name',
    alias: { n: 'name' },
  });
  const argKeys = Object.keys(args);

  // arg validation
  if (!args.name && !args.n) throw new Error(`expected name, got ${argKeys.join(', ')}`);
  if (args?._?.length) throw new Error(`invalid arg(s): ${args._.join(', ')}`);
  for (const key of argKeys) {
    if (!['_', 'name', 'n'].includes(key)) throw new Error(`${key} is not a valid arg`);
  }
  if (!/^[a-zA-Z0-9]+$/.test(args.name)) throw new Error('name has to meet /^[a-zA-Z0-9]+$/');

  return {
    name: args.name,
  };
};

const createFileName = (name) => {
  const timestamp = new Date().getTime();
  const migrationFileName = `${timestamp}_${name}.ts`;
  return migrationFileName;
};

create();
