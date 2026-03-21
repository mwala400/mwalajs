import fs from 'fs';
import path from 'path';
import readline from 'readline';
// import { sequelize } from './config/createTablesetdb.mjs';


// const { sequelize } = await import(
//   new URL('../config/createTablesetdb.mjs', import.meta.url)
// );
const sequelize = (await import(
  new URL('./config/createTablesetdb.mjs', import.meta.url)
)).sequelize;

import { DataTypes } from 'sequelize';

// Define directory for migrations
const migrationsDir = path.join(process.cwd(), 'migrations');
const migrationLog = path.join(migrationsDir, 'migration_log.json');

// Ensure migrations folder exists
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

if (!fs.existsSync(migrationLog)) {
  fs.writeFileSync(migrationLog, JSON.stringify([]));
}

const tableExists = async (tableName) => {
  const tables = await sequelize.getQueryInterface().showAllTables();
  return tables.includes(tableName);
};

export const createTable = async (tableName) => {
  if (await tableExists(tableName)) {
    console.log(` Table "${tableName}" already exists.`);
    const userResponse = await askUser(`Do you want to drop and recreate "${tableName}"? (yes/no): `);
    if (userResponse.toLowerCase() !== 'yes') {
      console.log(` Operation canceled.`);
      return;
    }
    await dropTable(tableName);
  }

  const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0];
  const migrationFile = path.join(migrationsDir, `${timestamp}_create_${tableName}.mjs`);

  const migrationTemplate = `

const sequelize = (await import(
  new URL('./config/createTablesetdb.mjs', import.meta.url)
)).sequelize;
import { DataTypes } from 'sequelize';

export const up = async () => {
  await sequelize.getQueryInterface().createTable('${tableName}', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() }
  });
};

export const down = async () => {
  await sequelize.getQueryInterface().dropTable('${tableName}');
};
`;

  fs.writeFileSync(migrationFile, migrationTemplate.trim());
  console.log(` Migration file created: ${migrationFile}`);
  console.log(` Run "mwala migrate all" to apply migrations.`);
};

export const dropTable = async (tableName) => {
  if (!(await tableExists(tableName))) {
    console.log(` Table "${tableName}" does not exist.`);
    return;
  }
  try {
    await sequelize.getQueryInterface().dropTable(tableName);
    console.log(` Table "${tableName}" dropped successfully.`);
  } catch (error) {
    console.error(` Failed to drop table "${tableName}": ${error.message}`);
  }
};

export const migrateAll = async () => {
  const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.mjs')).sort();
  const executedMigrations = JSON.parse(fs.readFileSync(migrationLog));
  console.log(` Found ${files.length} migration(s) to run.`);
  
  for (const file of files) {
    if (executedMigrations.includes(file)) continue;
    console.log(` Running migration: ${file}`);
    try {
      const migration = await import(`file://${path.join(migrationsDir, file)}`);
      await migration.up();
      executedMigrations.push(file);
      fs.writeFileSync(migrationLog, JSON.stringify(executedMigrations));
      console.log(` Migration ${file} completed.`);
    } catch (error) {
      console.error(` Migration failed: ${error.message}`);
    }
  }
};

export const rollbackLastMigration = async () => {
  const executedMigrations = JSON.parse(fs.readFileSync(migrationLog));
  if (executedMigrations.length === 0) {
    console.log(' No migrations to rollback.');
    return;
  }
  const lastMigration = executedMigrations.pop();
  console.log(` Rolling back migration: ${lastMigration}`);
  try {
    const migration = await import(`file://${path.join(migrationsDir, lastMigration)}`);
    await migration.down();
    fs.writeFileSync(migrationLog, JSON.stringify(executedMigrations));
    console.log(` Rolled back: ${lastMigration}`);
  } catch (error) {
    console.error(` Rollback failed: ${error.message}`);
  }
};

export const listTables = async () => {
  try {
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log(` Existing tables: ${tables.length > 0 ? tables.join(', ') : 'No tables found.'}`);
  } catch (error) {
    console.error(` Failed to fetch tables: ${error.message}`);
  }
};

const askUser = (question) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};
