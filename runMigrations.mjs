// runMigrations.mjs

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

import { sequelize } from 'mwalajs/config/createTablesetdb';

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


export const dropAllTables = async () => {
  try {
    const tables = await sequelize.getQueryInterface().showAllTables();
    
    if (tables.length === 0) {
      console.log('No tables exist in the database.');
      return;
    }

    console.log(`Dropping ${tables.length} table(s): ${tables.join(', ')}`);

    // Drop in reverse order to respect foreign key dependencies if any
    for (const table of tables.reverse()) {
      await sequelize.getQueryInterface().dropTable(table, { cascade: true });
      console.log(`  Dropped: ${table}`);
    }

    // Clear the migration tracking file so future migrates start clean
    fs.writeFileSync(migrationLog, JSON.stringify([]));
    console.log('Migration log cleared – ready for fresh migrations.');

  } catch (error) {
    console.error('Error while dropping all tables:', error.message);
    if (error.stack) console.error(error.stack);
    throw error; // let runSafe show the full error
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



// ────────────────────────────────────────────────
// MAINTENANCE TOOLS (MariaDB / MySQL compatible)
// ────────────────────────────────────────────────

export const showDatabaseSize = async () => {
  const dbName = sequelize.getDatabaseName(); // au tumia sequelize.config.database kama haifanyi kazi
  const [results] = await sequelize.query(`
    SELECT 
      ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
    FROM information_schema.tables 
    WHERE table_schema = '${dbName}'
  `);

  const size = results[0]?.size_mb || '0.00';
  console.log(`Database size: ${size} MB`);
};

export const listIndexes = async (tableName) => {
  const dbName = sequelize.getDatabaseName();
  const [results] = await sequelize.query(`
    SHOW INDEXES FROM \`${tableName}\`
  `);

  if (results.length === 0) {
    console.log(`Hakuna indexes kwenye table "${tableName}".`);
    return;
  }

  console.log(`Indexes kwenye "${tableName}":`);
  results.forEach(row => {
    const unique = row.Non_unique === 0 ? 'UNIQUE' : 'NON-UNIQUE';
    console.log(`  • ${row.Key_name.padEnd(35)} → ${unique} | Column: ${row.Column_name} | Type: ${row.Index_type}`);
  });
};

export const analyzeTable = async (tableName) => {
  await sequelize.query(`ANALYZE TABLE \`${tableName}\`;`);
  console.log(`Table "${tableName}" ime-analyze (statistics zime-update).`);
};

export const vacuumDatabase = async () => {
  // MySQL/MariaDB haina VACUUM kama PostgreSQL, lakini tunaweza optimize tables zote
  const dbName = sequelize.getDatabaseName();
  const [tables] = await sequelize.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = '${dbName}' 
      AND table_type = 'BASE TABLE'
  `);

  if (tables.length === 0) {
    console.log('Hakuna tables za ku-optimize.');
    return;
  }

  console.log(`Optimizing ${tables.length} table(s)...`);
  for (const row of tables) {
    const table = row.table_name;
    await sequelize.query(`OPTIMIZE TABLE \`${table}\`;`);
    console.log(`  Optimized: ${table}`);
  }
  console.log('Optimization imekamilika (space reclaimed na stats updated).');
};

export const showConnections = async () => {
  const [results] = await sequelize.query(`
    SHOW PROCESSLIST
  `);

  const active = results.filter(row => row.Command !== 'Sleep' && row.Id !== 0); // exclude idle + our connection

  if (active.length === 0) {
    console.log('Hakuna connections zingine active (isipokuwa yako).');
    return;
  }

  console.log(`Active connections (${active.length}):`);
  active.forEach(r => {
    const querySnippet = r.Info ? r.Info.substring(0, 60) + '...' : '(idle)';
    console.log(`  ID ${r.Id} | User: ${r.User} | Host: ${r.Host} | State: ${r.State} | Query: ${querySnippet}`);
  });
};

export const killConnections = async () => {
  const [results] = await sequelize.query(`
    SHOW PROCESSLIST
  `);

  const toKill = results.filter(row => row.Id !== 0 && row.Command !== 'Sleep'); // exclude our connection + idle

  if (toKill.length === 0) {
    console.log('Hakuna connections za ku-kill.');
    return;
  }

  console.log(`Killing ${toKill.length} connection(s)...`);
  for (const row of toKill) {
    try {
      await sequelize.query(`KILL ${row.Id};`);
      console.log(`  Killed ID ${row.Id}`);
    } catch (e) {
      console.warn(`  Failed to kill ${row.Id}: ${e.message}`);
    }
  }
  console.log('Kill operation imekamilika.');
};


export async function getFullDatabaseInfo() {
  try {
    const dbName = sequelize.getDatabaseName(); //  FIX

    console.log('\n DATABASE INSPECTOR');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🗄 Database: ${dbName}\n`);

    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME, ENGINE, TABLE_ROWS, 
             ROUND((DATA_LENGTH + INDEX_LENGTH)/1024/1024, 2) AS SIZE_MB,
             CREATE_TIME, UPDATE_TIME
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = '${dbName}'
    `);

    let totalSize = 0;
    let totalRows = 0;

    for (const table of tables) {
      totalSize += Number(table.SIZE_MB || 0);
      totalRows += Number(table.TABLE_ROWS || 0);

      console.log(`📦 TABLE: ${table.TABLE_NAME}`);
      console.log(`   • Engine: ${table.ENGINE}`);
      console.log(`   • Rows: ${table.TABLE_ROWS}`);
      console.log(`   • Size: ${table.SIZE_MB} MB`);
      console.log(`   • Created: ${table.CREATE_TIME}`);
      console.log(`   • Updated: ${table.UPDATE_TIME}`);

      const [indexes] = await sequelize.query(`
        SHOW INDEX FROM \`${table.TABLE_NAME}\`
      `);

      if (indexes.length) {
        console.log(`   • Indexes:`);
        indexes.forEach(idx => {
          console.log(`     - ${idx.Key_name} (${idx.Column_name})`);
        });
      }

      console.log('--------------------------------------');
    }

    console.log('\n SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total Tables : ${tables.length}`);
    console.log(`Total Rows   : ${totalRows}`);
    console.log(`Total Size   : ${totalSize.toFixed(2)} MB`);

    console.log('\n Database inspection complete\n');

  } catch (err) {
    console.error(' Failed to get database info:', err.message);
    if (err.stack) console.error(err.stack);
    throw err;
  }
}