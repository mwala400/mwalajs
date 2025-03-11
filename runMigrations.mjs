import fs from 'fs';
import path from 'path';
import { sequelize } from './config/createTablesetdb.mjs'; 
import { DataTypes } from 'sequelize';

// Define directory for migrations
const migrationsDir = path.join(process.cwd(), 'migrations');

// Hakikisha migrations folder ipo
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

/**
 * ✅ Function ya kuunda migration file
 * @param {string} tableName - Jina la table
 */
export const createTable = (tableName) => {
  const timestamp = new Date().toISOString().replace(/[-T:]/g, '').split('.')[0];
  const migrationFile = path.join(migrationsDir, `${timestamp}_create_${tableName}.mjs`);
    
  const migrationTemplate = `
import { sequelize } from '../config/createTablesetdb.mjs';
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
};

/**
 * ✅ Function ya kufuta table moja
 * @param {string} tableName - Jina la table
 */
export const dropTable = async (tableName) => {
  await sequelize.getQueryInterface().dropTable(tableName);
};

/**
 * ✅ Function ya kutekeleza migrations zote
 */
export const migrateAll = async () => {
  const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.mjs')).sort();
  
  for (const file of files) {
    const migration = await import(`file://${path.join(migrationsDir, file)}`);
    await migration.up();
  }
};
