// dbUtils.mjs
// Extended & hardened database utilities for CLI / admin tasks
// Supports MySQL/MariaDB, PostgreSQL, SQLite (best effort)

import { sequelize } from './createTablesetdb.mjs'; // adjust path if needed
// import fs from 'fs/promises'; // prefer promises version
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import readlineSync from 'readline-sync';

const VERBOSE = process.env.VERBOSE === 'true'; // set VERBOSE=true for more output

// ────────────────────────────────────────────────
// Logging helpers
// ────────────────────────────────────────────────

function logVerbose(...args) {
  if (VERBOSE) console.log('[VERBOSE]', ...args);
}

function logSuccess(msg) {
  console.log(`\x1b[32m[OK]\x1b[0m ${msg}`);
}

function logError(msg, err = null) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
  if (err) {
    console.error(err.message);
    if (VERBOSE) console.error(err.stack);
  }
}

// ────────────────────────────────────────────────
// Raw query helpers with better error context
// ────────────────────────────────────────────────

async function rawQuery(sql, replacements = [], options = {}) {
  try {
    logVerbose('Executing SELECT:', sql, 'replacements:', replacements);

    const queryResult = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
      raw: true,               // ← very important for consistent plain objects
      ...options,
    });

    // ── Force result to always be an array ────────────────────────────────
    let rows = [];

    if (Array.isArray(queryResult)) {
      rows = queryResult;
    }
    // Single row object returned directly (very common with SHOW TABLES)
    else if (queryResult && typeof queryResult === 'object' && queryResult !== null) {
      rows = [queryResult];
    }
    // null / undefined / unexpected → empty array
    else {
      rows = [];
    }

    return rows;
  } catch (err) {
    throw new Error(
      `SELECT failed\nSQL: ${sql}\nReplacements: ${JSON.stringify(replacements)}\n${err.message || err}`
    );
  }
}

async function rawExecute(sql, replacements = [], options = {}) {
  try {
    logVerbose('Executing:', sql, 'replacements:', replacements);
    const [result] = await sequelize.query(sql, {
      replacements,
      type: sequelize.QueryTypes.RAW,
      ...options,
    });
    return result;
  } catch (err) {
    throw new Error(`EXECUTE failed\nSQL: ${sql}\nReplacements: ${JSON.stringify(replacements)}\n${err.message}`);
  }
}

// ────────────────────────────────────────────────
// Dialect helpers
// ────────────────────────────────────────────────

function getDialect() {
  return sequelize.getDialect();
}

function isMySQL() {
  const d = getDialect();
  return d === 'mysql' || d === 'mariadb';
}

function isPostgres() {
  return getDialect() === 'postgres';
}

function isSQLite() {
  return getDialect() === 'sqlite';
}

// ────────────────────────────────────────────────
// Table operations
// ────────────────────────────────────────────────

export async function listTables() {
  try {
    let sql;
    let extractor;

    if (isMySQL()) {
      sql = 'SHOW TABLES';
      extractor = (row) => {
        // MySQL returns { Tables_in_database_name: "table_name" }
        const keys = Object.keys(row);
        if (keys.length === 0) return null;
        return row[keys[0]];   // take the first (and usually only) key's value
      };
    } else if (isPostgres()) {
      sql = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `;
      extractor = (row) => row.table_name;
    } else if (isSQLite()) {
      sql = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'";
      extractor = (row) => row.name;
    } else {
      throw new Error(`listTables: unsupported dialect ${getDialect()}`);
    }

    const rows = await rawQuery(sql);

    // Optional debug – remove after testing
    // console.log('[DEBUG listTables] rows type:', typeof rows, 'array?', Array.isArray(rows));
    // console.log('[DEBUG] first row:', rows[0] ? JSON.stringify(rows[0], null, 2) : 'no rows');

    const tableNames = rows
      .map(extractor)
      .filter(name => typeof name === 'string' && name.trim() !== '');

    if (tableNames.length === 0) {
      console.log('No tables found (or empty database).');
    } else {
      console.log(`Found ${tableNames.length} table(s):`);
      tableNames.forEach(name => console.log(`  • ${name}`));
    }

    return tableNames;
  } catch (err) {
    logError('Failed to list tables', err);
    throw err;
  }
}

export async function checkTableExists(tableName) {
  try {
    const tables = await listTables();
    const exists = tables.includes(tableName);
    console.log(`Table '${tableName}' exists: ${exists ? '\x1b[32mYES\x1b[0m' : '\x1b[33mNO\x1b[0m'}`);
    return exists;
  } catch (err) {
    logError(`Cannot check existence of ${tableName}`, err);
    return false;
  }
}

export async function describeTable(tableName) {
  try {
    let sql;

    if (isMySQL())      sql = 'DESCRIBE ??';
    else if (isPostgres()) sql = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = ? AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    else if (isSQLite()) sql = 'PRAGMA table_info(??)';
    else throw new Error(`describeTable not supported for ${getDialect()}`);

    const result = await rawQuery(sql, [tableName]);
    console.table(result);
    return result;
  } catch (err) {
    logError(`Failed to describe table ${tableName}`, err);
    throw err;
  }
}

export async function showCreateTable(tableName) {
  try {
    if (!isMySQL()) {
      console.log('showCreateTable is only supported on MySQL/MariaDB');
      return null;
    }

    const qi = sequelize.getQueryInterface();
    const quotedTable = qi.quoteIdentifier(tableName);

    const rows = await sequelize.query(
      `SHOW CREATE TABLE ${quotedTable}`,
      {
        type: sequelize.QueryTypes.SELECT,
        raw: true
      }
    );

    if (!rows || rows.length === 0) {
      throw new Error('No CREATE statement returned');
    }

    const createStmt = rows[0]['Create Table'] || Object.values(rows[0])[1];

    console.log(createStmt);
    return createStmt;

  } catch (err) {
    logError(`Failed to get CREATE TABLE for ${tableName}`, err);
    throw err;
  }
}


export async function countRows(tableName) {
  try {
    const qi = sequelize.getQueryInterface();
    const quotedTable = qi.quoteIdentifier(tableName);

    const sql = `SELECT COUNT(*) as count FROM ${quotedTable}`;

    // Use rawQuery without replacements
    const rows = await rawQuery(sql);

    if (rows.length === 0) {
      throw new Error('No result from COUNT query');
    }

    const count = Number(rows[0].count ?? 0);
    console.log(`Table ${tableName} contains \x1b[36m${count}\x1b[0m rows.`);
    return count;
  } catch (err) {
    logError(`Cannot count rows in ${tableName}`, err);
    throw err;
  }
}

// ────────────────────────────────────────────────
// Data modification
// ────────────────────────────────────────────────

export async function truncateTable(tableName) {
  try {
    if (!(await checkTableExists(tableName))) return;

    const qi = sequelize.getQueryInterface();
    const quotedTable = qi.quoteIdentifier(tableName);  // → `userh2` on MySQL/MariaDB

    let sql;
    if (isMySQL()) {
      sql = `TRUNCATE TABLE ${quotedTable}`;
    } else if (isPostgres()) {
      sql = `TRUNCATE TABLE ${quotedTable} RESTART IDENTITY CASCADE`;
    } else if (isSQLite()) {
      sql = `DELETE FROM ${quotedTable}`;
    } else {
      throw new Error(`truncateTable not implemented for ${getDialect()}`);
    }

    // Execute without replacements → avoids quoting bugs
    await sequelize.query(sql, { type: sequelize.QueryTypes.RAW });

    logSuccess(`Table ${tableName} truncated.`);
  } catch (err) {
    logError(`Failed to truncate ${tableName}`, err);
    throw err;
  }
}


export async function safeDropTable(tableName) {
  try {
    if (!(await checkTableExists(tableName))) {
      console.log(`Table ${tableName} does not exist — nothing to drop.`);
      return;
    }

    if (!readlineSync.keyInYNStrict(`\x1b[33mReally drop table '${tableName}'?\x1b[0m`)) {
      console.log('Operation cancelled.');
      return;
    }

    const qi = sequelize.getQueryInterface();
    const quoted = qi.quoteIdentifier(tableName);

    await sequelize.query(`DROP TABLE IF EXISTS ${quoted}`, {
      type: sequelize.QueryTypes.RAW
    });

    logSuccess(`Table ${tableName} dropped.`);
  } catch (err) {
    logError(`Failed to drop ${tableName}`, err);
    throw err;
  }
}

export async function renameTable(oldName, newName) {
  try {
    if (!(await checkTableExists(oldName))) {
      throw new Error(`Source table ${oldName} does not exist`);
    }

    if (await checkTableExists(newName)) {
      if (!readlineSync.keyInYNStrict(`Target table ${newName} already exists. Overwrite?`)) {
        console.log('Cancelled.');
        return;
      }
      await safeDropTable(newName);
    }

    // Get the dialect-aware quoting function
    const qi = sequelize.getQueryInterface();

    const oldQuoted = qi.quoteIdentifier(oldName);
    const newQuoted = qi.quoteIdentifier(newName);

    let sql;
    if (isPostgres()) {
      sql = `ALTER TABLE ${oldQuoted} RENAME TO ${newQuoted}`;
    } else {
      // MySQL, MariaDB, SQLite
      sql = `RENAME TABLE ${oldQuoted} TO ${newQuoted}`;
    }

    // No replacements needed anymore → safer
    await sequelize.query(sql, { type: sequelize.QueryTypes.RAW });

    logSuccess(`Renamed ${oldName} → ${newName}`);
  } catch (err) {
    logError(`Rename failed ${oldName} → ${newName}`, err);
    throw err;
  }
}

// ────────────────────────────────────────────────
// Export / Import features
// ────────────────────────────────────────────────
export async function exportTableToCsv(tableName, filename = `${tableName}.csv`) {
  try {
    const qi = sequelize.getQueryInterface();
    const quotedTable = qi.quoteIdentifier(tableName);

    const rows = await rawQuery(`SELECT * FROM ${quotedTable}`);
    if (rows.length === 0) {
      console.log(`Table ${tableName} is empty.`);
      return;
    }

    const headers = Object.keys(rows[0]);
    const lines = [
      headers.join(','),
      ...rows.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
    ];

    await fs.writeFile(filename, lines.join('\n'), 'utf-8');
    logSuccess(`Exported ${rows.length} rows → ${filename}`);
  } catch (err) {
    logError(`Export CSV failed for ${tableName}`, err);
    throw err;
  }
}

export async function exportTableToJson(tableName, filename = `${tableName}.json`) {
  try {
    const qi = sequelize.getQueryInterface();
    const quotedTable = qi.quoteIdentifier(tableName);

    const rows = await rawQuery(`SELECT * FROM ${quotedTable}`);

    await fs.writeFile(
      filename,
      JSON.stringify(rows, null, 2),
      'utf-8'
    );

    logSuccess(`Exported ${rows.length} rows (JSON) → ${filename}`);

  } catch (err) {
    logError(`Export JSON failed for ${tableName}`, err);
    throw err;
  }
}

/**
 * Dumps table structure + data as SQL INSERTs
 * Currently best quality on MySQL / MariaDB
 */
export async function exportTableToSql(
  tableName,
  filename = `${tableName}.sql`,
  options = {}
) {
  const { includeStructure = true, batchSize = 500 } = options;

  try {
    const qi = sequelize.getQueryInterface();
    const quotedTable = qi.quoteIdentifier(tableName);

    let output = [];

    // ───────── STRUCTURE ─────────
    if (includeStructure && isMySQL()) {
      const create = await showCreateTable(tableName);

      if (create) {
        output.push('-- Table structure');
        output.push(create + ';');
        output.push('');
      }
    }

    // ───────── DATA ─────────
    const rows = await rawQuery(`SELECT * FROM ${quotedTable}`);

    if (rows.length === 0) {
      console.log('No data to export.');
      return;
    }

    output.push(`-- Data for table ${tableName}`);
    output.push(`DELETE FROM ${quotedTable};`);
    output.push('');

    // ───────── INSERT CHUNKS ─────────
    for (let i = 0; i < rows.length; i += batchSize) {
      const chunk = rows.slice(i, i + batchSize);

      const columns = Object.keys(chunk[0])
        .map(col => `\`${col}\``)
        .join(', ');

      const values = chunk.map(row => {
        const vals = Object.values(row).map(v => {
          if (v === null) return 'NULL';
          if (typeof v === 'string') {
            return `'${v.replace(/'/g, "''")}'`;
          }
          return v;
        });

        return `(${vals.join(', ')})`;
      });

      output.push(`INSERT INTO ${quotedTable} (${columns}) VALUES`);
      output.push(values.join(',\n') + ';');
      output.push('');
    }

    await fs.writeFile(filename, output.join('\n'), 'utf-8');

    logSuccess(`Exported table ${tableName} (${rows.length} rows) → ${filename}`);

  } catch (err) {
    logError(`SQL export failed for ${tableName}`, err);
    throw err;
  }
}


// ────────────────────────────────────────────────
// More utilities popular among developers
// ────────────────────────────────────────────────

export async function optimizeTable(tableName) {
  if (!isMySQL()) {
    console.log('OPTIMIZE TABLE is MySQL/MariaDB specific.');
    return;
  }
  try {
    await rawExecute('OPTIMIZE TABLE ??', [tableName]);
    logSuccess(`Table ${tableName} optimized.`);
  } catch (err) {
    logError(`Optimize failed for ${tableName}`, err);
  }
}

export async function bulkInsert(tableName, rows) {
  if (!rows?.length) return;

  try {
    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => '?').join(',');
    const sql = `INSERT INTO ?? (${columns.join(',')}) VALUES (${placeholders})`;

    for (const row of rows) {
      await rawExecute(sql, [tableName, ...Object.values(row)]);
    }
    logSuccess(`Bulk inserted ${rows.length} rows into ${tableName}`);
  } catch (err) {
    logError('Bulk insert failed', err);
    throw err;
  }
}

export async function getRowByPrimaryKey(tableName, id, idColumn = 'id') {
  try {
    const sql = `SELECT * FROM ?? WHERE ?? = ? LIMIT 1`;
    const [row] = await rawQuery(sql, [tableName, idColumn, id]);
    if (!row) console.log(`No row found in ${tableName} with ${idColumn} = ${id}`);
    return row || null;
  } catch (err) {
    logError(`Failed to fetch row from ${tableName}`, err);
    throw err;
  }
}


/**
 * Copies a table (structure + data) to a new table name.
 * - Overwrites destination if it exists (with confirmation).
 * - Best support: MySQL/MariaDB
 * - Partial support: PostgreSQL, SQLite (structure may be incomplete)
 */
export async function copyTable(sourceTable, destTable) {
  try {
    if (!(await checkTableExists(sourceTable))) {
      throw new Error(`Source table '${sourceTable}' does not exist`);
    }

    if (await checkTableExists(destTable)) {
      if (!readlineSync.keyInYNStrict(
        `\x1b[33mTarget table '${destTable}' already exists. Overwrite (drop + copy)?\x1b[0m`
      )) {
        console.log('Operation cancelled.');
        return;
      }
      await safeDropTable(destTable);
    }

    const qi = sequelize.getQueryInterface();
    const srcQuoted = qi.quoteIdentifier(sourceTable);
    const destQuoted = qi.quoteIdentifier(destTable);

    let sqlStructure;
    let sqlData;

    if (isMySQL()) {
      // Best quality on MySQL/MariaDB
      sqlStructure = `CREATE TABLE ${destQuoted} LIKE ${srcQuoted}`;
      sqlData = `INSERT INTO ${destQuoted} SELECT * FROM ${srcQuoted}`;
    } else if (isPostgres()) {
      sqlStructure = `CREATE TABLE ${destQuoted} (LIKE ${srcQuoted} INCLUDING ALL)`;
      sqlData = `INSERT INTO ${destQuoted} SELECT * FROM ${srcQuoted}`;
    } else if (isSQLite()) {
      // SQLite: CREATE TABLE AS SELECT copies data + basic structure, but loses indexes/constraints
      sqlStructure = null; // we'll combine into one statement
      sqlData = `CREATE TABLE ${destQuoted} AS SELECT * FROM ${srcQuoted}`;
    } else {
      throw new Error(`copyTable not supported for dialect: ${getDialect()}`);
    }

    // Execute structure creation
    if (sqlStructure) {
      await sequelize.query(sqlStructure, { type: sequelize.QueryTypes.RAW });
    }

    // Execute data copy
    if (sqlData) {
      await sequelize.query(sqlData, { type: sequelize.QueryTypes.RAW });
    }

    logSuccess(`Table copied: ${sourceTable} → ${destTable}`);

    // Optional: show row count in destination to confirm
    await countRows(destTable);
  } catch (err) {
    logError(`Failed to copy table ${sourceTable} → ${destTable}`, err);
    throw err;
  }
}

export async function importCsvToTable(
  filename,
  tableName,
  options = {}
) {
  const { skipErrors = true, truncate = false, batchSize = 500 } = options;

  const qi = sequelize.getQueryInterface();
  const quotedTable = qi.quoteIdentifier(tableName);

  const transaction = await sequelize.transaction();

  try {
    const content = await fs.readFile(filename, 'utf-8');

    const lines = content
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      throw new Error('CSV is empty or invalid');
    }

    const headers = lines[0].split(',').map(h => h.trim());

    if (truncate) {
      await sequelize.query(`TRUNCATE TABLE ${quotedTable}`, { transaction });
    }

    let successCount = 0;
    let failCount = 0;

    // batch processing
    for (let i = 1; i < lines.length; i += batchSize) {
      const chunk = lines.slice(i, i + batchSize);

      for (const line of chunk) {
        try {
          const values = line.split(',').map(v => v.replace(/^"|"$/g, ''));

          if (values.length !== headers.length) {
            throw new Error('Column count mismatch');
          }

          const cols = headers.map(h => `\`${h}\``).join(', ');
          const vals = values.map(v => {
            if (v === '' || v.toLowerCase() === 'null') return 'NULL';
            return `'${v.replace(/'/g, "''")}'`;
          }).join(', ');

          const sql = `INSERT INTO ${quotedTable} (${cols}) VALUES (${vals})`;

          await sequelize.query(sql, { transaction });

          successCount++;

        } catch (err) {
          failCount++;
          if (!skipErrors) throw err;

          console.warn(` Skipped row: ${line}`);
        }
      }
    }

    await transaction.commit();

    logSuccess(
      `CSV imported → ${tableName} |  ${successCount} rows |  ${failCount} skipped`
    );

  } catch (err) {
    await transaction.rollback();
    logError(`CSV import failed for ${tableName}`, err);
    throw err;
  }
}


export async function importJsonToTable(
  filename,
  tableName,
  options = {}
) {
  const { skipErrors = true, truncate = false } = options;

  const qi = sequelize.getQueryInterface();
  const quotedTable = qi.quoteIdentifier(tableName);

  const transaction = await sequelize.transaction();

  try {
    const content = await fs.readFile(filename, 'utf-8');
    const rows = JSON.parse(content);

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('Invalid JSON format');
    }

    if (truncate) {
      await sequelize.query(`TRUNCATE TABLE ${quotedTable}`, { transaction });
    }

    let successCount = 0;
    let failCount = 0;

    for (const row of rows) {
      try {
        const cols = Object.keys(row).map(c => `\`${c}\``).join(', ');
        const vals = Object.values(row).map(v => {
          if (v === null) return 'NULL';
          if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
          return v;
        }).join(', ');

        const sql = `INSERT INTO ${quotedTable} (${cols}) VALUES (${vals})`;

        await sequelize.query(sql, { transaction });

        successCount++;

      } catch (err) {
        failCount++;
        if (!skipErrors) throw err;

        console.warn(` Skipped row: ${JSON.stringify(row)}`);
      }
    }

    await transaction.commit();

    logSuccess(
      `JSON imported → ${tableName} |  ${successCount} rows |  ${failCount} skipped`
    );

  } catch (err) {
    await transaction.rollback();
    logError(`JSON import failed for ${tableName}`, err);
    throw err;
  }
}
export async function importSqlToTable(filename, options = {}) {
  const {
    autoDrop = false,
    confirmDrop = true,
    skipCreateTable = false,
  } = options;

  const transaction = await sequelize.transaction();

  try {
    const content = await fs.readFile(filename, 'utf-8');

    // 1. Clean comments
    const cleaned = content
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');

    // 2. Split safely
    const statements = cleaned
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(Boolean);

    // 3. Detect dangerous operations
    const hasCreateTable = statements.some(s =>
      /^CREATE TABLE/i.test(s)
    );

    const hasDropTable = statements.some(s =>
      /^DROP TABLE/i.test(s)
    );

    // 4. Confirm destructive actions
    if ((hasCreateTable || hasDropTable) && confirmDrop) {
      const readlineSync = (await import('readline-sync')).default;

      console.warn('\n⚠️ SQL file contains destructive operations:');
      if (hasCreateTable) console.warn(' - CREATE TABLE');
      if (hasDropTable) console.warn(' - DROP TABLE');

      const ok = readlineSync.keyInYNStrict(
        'Do you want to continue?'
      );

      if (!ok) {
        throw new Error('Operation cancelled by user');
      }
    }

    // 5. Execute statements safely
    let executed = 0;
    let skipped = 0;

    for (const stmt of statements) {
      const upper = stmt.toUpperCase();

      try {
        // OPTIONAL: skip CREATE TABLE if autoDrop disabled
        if (upper.startsWith('CREATE TABLE') && skipCreateTable) {
          console.warn(' Skipped CREATE TABLE');
          skipped++;
          continue;
        }

        // AUTO DROP MODE (recreate logic)
        if (upper.startsWith('CREATE TABLE') && autoDrop) {
          const tableMatch = stmt.match(/CREATE TABLE\s+`?(\w+)`?/i);

          if (tableMatch) {
            const table = tableMatch[1];

            console.warn(` Dropping existing table: ${table}`);

            await sequelize.query(
              `DROP TABLE IF EXISTS \`${table}\``,
              { transaction }
            );
          }
        }

        await sequelize.query(stmt, {
          type: sequelize.QueryTypes.RAW,
          transaction
        });

        executed++;

      } catch (err) {
        skipped++;
        console.warn(` Failed statement: ${stmt.slice(0, 80)}`);
        console.warn(err.message);
      }
    }

    await transaction.commit();

    logSuccess(
      `SQL import complete → executed: ${executed}, skipped: ${skipped}`
    );

  } catch (err) {
    await transaction.rollback();
    logError('SQL import failed', err);
    throw err;
  }
}


export async function backupDatabase(options = {}) {
  const {
    name,
    includeData = true,
    outputDir = '.',
    override = false,
  } = options;

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const dbName = sequelize.config?.database || 'database';
    const dialect = sequelize.getDialect(); // mysql | postgres | mssql | etc

    // ─────────────────────────────
    // 1. SMART EXTENSION BY DB TYPE
    // ─────────────────────────────
    let extension = '.sql';

    if (dialect === 'mongo' || dialect === 'mongodb') {
      extension = '.json';
    } else if (dialect === 'postgres') {
      extension = '.sql';
    } else if (dialect === 'mysql') {
      extension = '.sql';
    }

    // ─────────────────────────────
    // 2. SMART NAME RULES
    // ─────────────────────────────
    let fileBase;

    if (name) {
      fileBase = path.parse(name).name; // remove extension if user added
    } else {
      fileBase = `${dbName}_backup_${timestamp}`;
    }

    let fileName = fileBase + extension;

    const filePath = path.join(outputDir, fileName);

    // ─────────────────────────────
    // 3. HANDLE DUPLICATES
    // ─────────────────────────────
    let finalPath = filePath;

    if (!override && fsSync.existsSync(filePath)) {
      let i = 1;
      while (
        fsSync.existsSync(
          path.join(outputDir, `${fileBase}_${i}${extension}`)
        )
      ) {
        i++;
      }

      finalPath = path.join(outputDir, `${fileBase}_${i}${extension}`);
    }

    // ─────────────────────────────
    // 4. BUILD BACKUP
    // ─────────────────────────────
    const tables = await listTables();
    const dump = [];

    dump.push(`-- MWALAJS BACKUP`);
    dump.push(`-- DB: ${dbName}`);
    dump.push(`-- TYPE: ${dialect}`);
    dump.push(`-- DATE: ${new Date().toISOString()}`);
    dump.push('\n');

    for (const table of tables) {
      const qi = sequelize.getQueryInterface();
      const quoted = qi.quoteIdentifier(table);

      if (dialect === 'mysql') {
        const create = await sequelize.query(
          `SHOW CREATE TABLE ${quoted}`,
          { type: sequelize.QueryTypes.SELECT }
        );

        const createSQL =
          create[0]['Create Table'] || Object.values(create[0])[1];

        dump.push(`DROP TABLE IF EXISTS \`${table}\`;`);
        dump.push(createSQL + ';\n');
      }

      if (includeData) {
        const rows = await rawQuery(`SELECT * FROM ${quoted}`);

        if (rows.length > 0) {
          const cols = Object.keys(rows[0])
            .map(c => `\`${c}\``)
            .join(',');

          for (const row of rows) {
            const vals = Object.values(row).map(v => {
              if (v === null) return 'NULL';
              if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
              return v;
            });

            dump.push(
              `INSERT INTO \`${table}\` (${cols}) VALUES (${vals.join(',')});`
            );
          }
        }
      }

      dump.push('\n');
    }

    // ─────────────────────────────
    // 5. WRITE FILE
    // ─────────────────────────────
    await fs.writeFile(finalPath, dump.join('\n'), 'utf-8');

    logSuccess(`Database backup created → ${finalPath}`);
    return finalPath;

  } catch (err) {
    logError('Backup failed', err);
    throw err;
  }
}

export async function restoreDatabase(filePath, options = {}) {
  const { confirm = true } = options;

  const transaction = await sequelize.transaction();

  try {
    const content = await fs.readFile(filePath, 'utf-8');

    const readlineSync = (await import('readline-sync')).default;

    if (confirm) {
      console.warn(' You are about to RESTORE database (will overwrite data)');
      const ok = readlineSync.keyInYNStrict('Continue restore?');

      if (!ok) throw new Error('Restore cancelled');
    }

    const statements = content
      .replace(/--.*$/gm, '')
      .split(/;\s*\n/)
      .map(s => s.trim())
      .filter(Boolean);

    let executed = 0;

    for (const stmt of statements) {
      await sequelize.query(stmt, {
        transaction,
        type: sequelize.QueryTypes.RAW,
      });
      executed++;
    }

    await transaction.commit();

    logSuccess(`Database restored successfully (${executed} queries)`);

  } catch (err) {
    await transaction.rollback();
    logError('Restore failed', err);
    throw err;
  }
}

export async function seedDatabase(seeds = []) {
  try {
    if (!Array.isArray(seeds)) {
      throw new Error('Seeds must be an array');
    }

    let inserted = 0;

    for (const seed of seeds) {
      const { table, data } = seed;

      if (!table || !data) continue;

      const qi = sequelize.getQueryInterface();
      const quoted = qi.quoteIdentifier(table);

      for (const row of data) {
        const cols = Object.keys(row)
          .map(c => `\`${c}\``)
          .join(',');

        const vals = Object.values(row).map(v => {
          if (v === null) return 'NULL';
          if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
          return v;
        });

        await sequelize.query(
          `INSERT INTO ${quoted} (${cols}) VALUES (${vals.join(',')})`
        );

        inserted++;
      }
    }

    logSuccess(`Seed completed → ${inserted} rows inserted`);

  } catch (err) {
    logError('Seed failed', err);
    throw err;
  }
}




async function getAllTablesSafe() {
  const qi = sequelize.getQueryInterface();
  let tables = await qi.showAllTables();

  return tables.map(t =>
    typeof t === 'object' ? Object.values(t)[0] : t
  );
}

import os from 'os';
import { execSync } from 'child_process';

function resolveOutDir(dir) {
  return path.isAbsolute(dir)
    ? dir
    : path.join(process.cwd(), dir);
}

function ensureDirInteractive(dir) {
  const abs = resolveOutDir(dir);

  if (fsSync.existsSync(abs)) {
    const overwrite = readlineSync.keyInYNStrict(
      ` Folder exists: ${abs}\nOverwrite contents?`
    );

    if (!overwrite) {
      console.log(' Operation cancelled.');
      process.exit(0);
    }

    // clean folder
    fsSync.rmSync(abs, { recursive: true, force: true });
  }

  fsSync.mkdirSync(abs, { recursive: true });
  return abs;
}

function zipDirectory(sourceDir, outPath) {
  try {
    const platform = os.platform();

    if (platform === 'win32') {
      // PowerShell zip
      execSync(`powershell Compress-Archive -Path "${sourceDir}\\*" -DestinationPath "${outPath}" -Force`);
    } else {
      execSync(`zip -r "${outPath}" "${sourceDir}"`);
    }

    console.log(` ZIP created → ${outPath}`);
  } catch (err) {
    console.warn(' ZIP failed (zip not installed?)');
  }
}


export async function exportAllTablesToJson(outputDir = './exports/json') {
  try {
    const tables = await getAllTablesSafe();
    const absDir = ensureDirInteractive(outputDir);

    console.log(`\ Exporting ${tables.length} tables → JSON\n`);

    let index = 1;

    for (const table of tables) {
      const filePath = path.join(absDir, `${table}.json`);

      const rows = await rawQuery(`SELECT * FROM \`${table}\``);

      await fs.writeFile(filePath, JSON.stringify(rows, null, 2));

      console.log(
        ` [${index}/${tables.length}] ${table} → ${rows.length} rows`
      );

      index++;
    }

    zipDirectory(absDir, `${absDir}.zip`);

    logSuccess(`JSON export complete → ${absDir}`);
  } catch (err) {
    logError('exportAllTablesToJson failed', err);
    throw err;
  }
}

export async function exportAllTablesToCsv(outputDir = './exports/csv') {
  try {
    const tables = await getAllTablesSafe();
    const absDir = ensureDirInteractive(outputDir);

    console.log(`\ Exporting ${tables.length} tables → CSV\n`);

    let index = 1;

    for (const table of tables) {
      const filePath = path.join(absDir, `${table}.csv`);

      const rows = await rawQuery(`SELECT * FROM \`${table}\``);

      if (rows.length === 0) {
        await fs.writeFile(filePath, '');
      } else {
        const headers = Object.keys(rows[0]);
        const lines = [
          headers.join(','),
          ...rows.map(r =>
            headers.map(h => JSON.stringify(r[h] ?? '')).join(',')
          ),
        ];

        await fs.writeFile(filePath, lines.join('\n'));
      }

      console.log(
        ` [${index}/${tables.length}] ${table} → ${rows.length} rows`
      );

      index++;
    }

    zipDirectory(absDir, `${absDir}.zip`);

    logSuccess(`CSV export complete → ${absDir}`);
  } catch (err) {
    logError('exportAllTablesToCsv failed', err);
    throw err;
  }
}

// export async function exportAllTablesToSql(outputDir = './exports/sql') {
//   try {
//     const tables = await getAllTablesSafe();
//     const absDir = ensureDirInteractive(outputDir);

//     console.log(`\ Exporting ${tables.length} tables → SQL\n`);

//     let index = 1;

//     for (const table of tables) {
//       const filePath = path.join(absDir, `${table}.sql`);

//       await exportTableToSql(table, filePath);

//       const count = await countRows(table);

//       console.log(
//         ` [${index}/${tables.length}] ${table} → ${count} rows`
//       );

//       index++;
//     }

//     zipDirectory(absDir, `${absDir}.zip`);

//     logSuccess(`SQL export complete → ${absDir}`);
//   } catch (err) {
//     logError('exportAllTablesToSql failed', err);
//     throw err;
//   }
// }

export async function exportAllTablesToSql(outputDir = './exports/sql') {
  try {
    const tables = await getAllTablesSafe();

    // 🔹 Resolve absolute path
    const absDir = path.isAbsolute(outputDir)
      ? outputDir
      : path.join(process.cwd(), outputDir);

    // 🔹 Interactive overwrite
    if (fsSync.existsSync(absDir)) {
      const overwrite = readlineSync.keyInYNStrict(
        ` Folder exists: ${absDir}\nOverwrite contents?`
      );

      if (!overwrite) {
        console.log(' Export cancelled.');
        return;
      }

      fsSync.rmSync(absDir, { recursive: true, force: true });
    }

    fsSync.mkdirSync(absDir, { recursive: true });

    console.log(`\ Exporting ${tables.length} tables → SQL\n`);

    let index = 1;
    let totalRows = 0;

    for (const table of tables) {
      const filePath = path.join(absDir, `${table}.sql`);

      // 🔹 export SQL
      await exportTableToSql(table, filePath);

      // 🔹 get row count (informative)
      let count = 0;
      try {
        count = await countRows(table);
      } catch {
        count = 0;
      }

      totalRows += count;

      console.log(
        ` [${index}/${tables.length}] ${table} → ${count} rows`
      );

      index++;
    }

    // 🔹 ZIP backup
    try {
      const zipPath = `${absDir}.zip`;

      const { execSync } = await import('child_process');
      const os = (await import('os')).default;

      if (os.platform() === 'win32') {
        execSync(
          `powershell Compress-Archive -Path "${absDir}\\*" -DestinationPath "${zipPath}" -Force`
        );
      } else {
        execSync(`zip -r "${zipPath}" "${absDir}"`);
      }

      console.log(` ZIP created → ${zipPath}`);
    } catch (zipErr) {
      console.warn(' ZIP failed (zip not installed)');
    }

    logSuccess(
      `SQL export complete → ${absDir} | Tables: ${tables.length} | Rows: ${totalRows}`
    );

  } catch (err) {
    logError('exportAllTablesToSql failed', err);
    throw err;
  }
}




////impoting all added
// Function ya msaada kutafuta files kwenye folder
async function getFilesFromDir(dir, extension) {
  if (!fsSync.existsSync(dir)) throw new Error(`Folder halipo: ${dir}`);
  const files = fsSync.readdirSync(dir);
  return files
    .filter(f => f.endsWith(extension))
    .map(f => ({
      fullPath: path.join(dir, f),
      tableName: path.basename(f, extension) // Inachukua jina la file kama jina la table
    }));
}

export async function importAllFromFolder(folderPath, type = 'all') {
  const absPath = path.isAbsolute(folderPath) ? folderPath : path.join(process.cwd(), folderPath);
  
  // Tunaamua ni aina gani ya files tufanye kazi nazo
  const typesToProcess = type === 'all' ? ['sql', 'csv', 'json'] : [type];
  
  console.log(`\n Starting Bulk Import from: ${absPath}\n`);

  for (const ext of typesToProcess) {
    const files = await getFilesFromDir(absPath, `.${ext}`);
    if (files.length === 0) continue;

    console.log(`\n Processing ${ext.toUpperCase()} files (${files.length})...`);

    for (const file of files) {
      try {
        if (ext === 'sql') {
          await importSqlToTable(file.fullPath);
        } else if (ext === 'csv') {
          await importCsvToTable(file.fullPath, file.tableName);
        } else if (ext === 'json') {
          await importJsonToTable(file.fullPath, file.tableName);
        }
        console.log(` Imported: ${file.tableName}.${ext}`);
      } catch (err) {
        console.error(` Failed: ${file.tableName}.${ext} -> ${err.message}`);
      }
    }
  }
  logSuccess('Bulk Import process completed!');
}

// Export everything
export default {
  listTables,
  checkTableExists,
  describeTable,
  showCreateTable,
  countRows,
  truncateTable,
  safeDropTable,
  renameTable,
  exportTableToCsv,
  exportTableToJson,
  exportTableToSql,
  optimizeTable,
  bulkInsert,
  getRowByPrimaryKey,
  copyTable,
  importCsvToTable,
  importJsonToTable,
  importSqlToTable,
  backupDatabase,
  restoreDatabase,
  seedDatabase,
  importAllFromFolder,
  // ... add more as needed
};