#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import readlineSync from 'readline-sync';

//(baada ya imports zingine)
import pkg from "../package.json" with { type: "json" };

// const pkg = JSON.parse(
//   fs.readFileSync(new URL('../package.json', import.meta.url))
// );

// Colors for better UX
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const error = (msg) => console.error(`${colors.red}❌ ${msg}${colors.reset}`);
const success = (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`);
const warn = (msg) => console.warn(`${colors.yellow}⚠️  ${msg}${colors.reset}`);
const info = (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ────────────────────────────────────────────────
// Dynamic imports with error handling
// ────────────────────────────────────────────────


let imports = {};

try {
  const [
    dbCfg,
    migrations,
    setup,
    proj,
    dbUtilsRaw,
  ] = await Promise.all([
    import(pathToFileURL(path.join(__dirname, '../config/createdatabase.mjs')).href),
    import(pathToFileURL(path.join(__dirname, '../runMigrations.mjs')).href),
    import(pathToFileURL(path.join(__dirname, '../setupMwalajs.mjs')).href),
    import(pathToFileURL(path.join(__dirname, '../createProject.mjs')).href),
    import(pathToFileURL(path.join(__dirname, '../config/dbUtils.mjs')).href),
  ]);

  // 🔥 FIX: handle default export OR named export safely
const normalize = (mod) => mod?.default ?? mod ?? {};

imports = {
  ...normalize(dbCfg),
  ...normalize(migrations),
  ...normalize(setup),
  ...normalize(proj),
  ...normalize(dbUtilsRaw),
};

} catch (err) {
  error(`Failed to load required modules:\n${err.stack || err.message}`);
  process.exit(1);
}

const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();



if (!command || command === 'help' || command === 'h') {
  console.log(`
${colors.bright}╔════════════════════════════════════════════════════╗${colors.reset}
${colors.bright}║             MwalaJS CLI v${pkg.version}            ║${colors.reset}
${colors.bright}╚════════════════════════════════════════════════════╝${colors.reset}

${colors.cyan}General Commands:${colors.reset}
  mwala -v | --version           → Show version
  mwala help | h                → Show this help

${colors.cyan}Project Management:${colors.reset}
  mwala create-project          → Create new project
  mwala init                    → Initialize MwalaJS in current directory

${colors.cyan}Run Application:${colors.reset}
  mwala serve | app.mjs         → Start server (runs app.mjs)

${colors.cyan}Code Generation:${colors.reset}
  mwala generate model <name>
  mwala generate controller <name>
  mwala generate route <name>
  mwala generate view <name>
  mwala generate midware <name>

${colors.cyan}══════════════════════════════════════════════════════${colors.reset}
${colors.cyan}                  DATABASE COMMANDS                   ${colors.reset}
${colors.cyan}══════════════════════════════════════════════════════${colors.reset}

${colors.blue}Setup & Config:${colors.reset}
  mwala create-db               → Create / connect database (interactive)
  mwala db:config              → Reconfigure database settings

${colors.blue}Table Management:${colors.reset}
  mwala db:table list
  mwala db:table create <name>
  mwala db:table drop <name>
  mwala db:table truncate <name>
  mwala db:table rename <old> <new>
  mwala db:table copy <src> <dest>
  mwala db:table exists <name>
  mwala db:table describe <name>
  mwala db:table count <name>

${colors.blue}Migrations:${colors.reset}
  mwala migrate all
  mwala rollback last
  mwala rollback all            → ⚠️ drops all tables (dangerous)

${colors.blue}Data Import / Export:${colors.reset}
  mwala db:import <file.csv|json|sql> <table>
  mwala db:export <table> <file.csv|json|sql>

  Examples:
    mwala db:import users.csv users
    mwala db:import users.json users
    mwala db:import backup.sql users

${colors.blue}Backup & Restore:${colors.reset}
  mwala db:seed <file.js>
  mwala db:backup
  mwala db:restore <file.sql>

${colors.blue}Maintenance & Stats:${colors.reset}
  mwala db:size
  mwala db:indexes <table>
  mwala db:analyze <table>      → PostgreSQL only
  mwala db:reindex <table>
  mwala db:vacuum
  mwala db:connections
  mwala db:kill-connections     → ⚠️ Dangerous – admin only
  mwala db:drop-all-tables      → ⚠️ Extremely dangerous

${colors.yellow}Tips:${colors.reset}
  - CSV/JSON = insert data only
  - SQL = schema + data control
  - Use --truncate for clean import (if supported)

Use: mwala <command> [options]
  `);

  process.exit(0);
}

// ────────────────────────────────────────────────
// Helper – run async function with error handling
// ────────────────────────────────────────────────

async function runSafe(fn, successMsg = 'Operation completed', errorPrefix = 'Operation failed') {
  try {
    await fn();
    success(successMsg);
  } catch (err) {
    error(`${errorPrefix}: ${err.message}`);
    if (err.stack) console.error(colors.dim + err.stack + colors.reset);
    process.exitCode = 1;
  }
}

function runSafeSync(fn, successMsg = 'Operation completed', errorPrefix = 'Operation failed') {
  try {
    fn();
    success(successMsg);
  } catch (err) {
    error(`${errorPrefix}: ${err.message}`);
    if (err.stack) console.error(colors.dim + err.stack + colors.reset);
    process.exitCode = 1;
  }
}


// ────────────────────────────────────────────────
// Command router
// ────────────────────────────────────────────────

(async () => {
  try {
    switch (command) {
      // case 'version':
      // case '-v':
      // case '--version':
      //   console.log('MwalaJS Version: 1.1.0');
      //   break;

     case 'version':
     case '-v':
     case '--version':
     console.log(`MwalaJS Version: ${pkg.version}`);
     break;

      case 'create-project':
        runSafeSync(createProject, 'Project created successfully');
        break;

      case 'init':
        runSafe(setupMwalajs, 'MwalaJS initialized successfully');
        break;

      case 'serve':
      case 'app.mjs': {
        const { spawn } = await import('child_process');
        info('Starting application server...');
        const child = spawn('node', ['app.mjs'], {
          stdio: 'inherit',
          cwd: process.cwd(),
        });

        process.on('SIGINT', () => child.kill('SIGINT'));
        process.on('SIGTERM', () => child.kill('SIGTERM'));

        child.on('exit', (code) => {
          console.log(`Server exited with code ${code}`);
          process.exit(code || 0);
        });

        child.on('error', (err) => {
          error(`Failed to start server: ${err.message}`);
          process.exit(1);
        });
        break;
      }

     case 'generate': {
  const subCommand = args[1]?.toLowerCase();
  const name = args[2];

  if (!subCommand || !name) {
    console.log(' Please specify both subCommand and name.');
    process.exit(1);
  }

  const paths = {
    model: 'models',
    controller: 'controllers',
    route: 'routes',
    view: 'views',
    midware: 'middlewares'
  };

  if (!paths[subCommand]) {
    console.log(` Invalid subCommand: ${subCommand}. Valid options are: ${Object.keys(paths).join(', ')}`);
    process.exit(1);
  }

  // 🔥 dynamic extension
  const ext = subCommand === 'view' ? '.ejs' : '.mjs';
  const filePath = path.join(process.cwd(), paths[subCommand], `${name}${ext}`);

  if (fs.existsSync(filePath)) {
    console.log(` ${name} ${subCommand} already exists.`);
    process.exit(1);
  }

  let content = '';

  switch (subCommand) {
    case 'model':
      content = `export const ${name}Model = {};`;
      break;

    case 'controller':
      content = `export const ${name}Controller = { get${name}Page: (req, res) => { res.render('${name}', { title: '${name} Page' }); } };`;
      break;

    case 'route':
      content = `import mwalajs from 'mwalajs';
import { ${name}Controller } from '../controllers/${name}Controller.mjs';

const router = mwalajs.Router();

router.get('/', ${name}Controller.get${name}Page);

export { router as ${name}Route };`;
      break;

    case 'view':
      content = `<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <title>${name} Page</title>
</head>
<body>
  <h1>${name} View Page</h1>
</body>
</html>`;
      break;

    case 'midware':
      content = `export const ${name} = (req, res, next) => { next(); };`;
      break;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);

  console.log(` ${name} ${subCommand} created successfully in ${paths[subCommand]}/`);
  break;
}

      // ── Database Commands ─────────────────────────────────────

      case 'create-db':
        await runSafe(
          () => getDbConnection().then(() => {}),
          'Database connection established',
          'Database setup failed'
        );
        break;

      case 'db:config':
        await runSafe(
          () => getDbConnection(),
          'Database configuration updated',
          'Configuration failed'
        );
        break;

      case 'db:table': {
        const sub = args[1]?.toLowerCase();
        const arg1 = args[2];
        const arg2 = args[3];

        if (!sub) {
          error('Subcommand required. Use: mwala db:table list | create | drop | ...');
          process.exit(1);
        }

        switch (sub) {
          case 'list':
            await runSafe(listTables, 'Tables listed');
            break;

          case 'create':
            if (!arg1) return error('Table name required: mwala db:table create <name>');
            await runSafe(() => createTable(arg1), `Table ${arg1} created`);
            break;

          case 'drop':
            if (!arg1) return error('Table name required');
            await runSafe(() => dropTable(arg1), `Table ${arg1} dropped`);
            break;

          case 'truncate':
            if (!arg1) return error('Table name required');
            await runSafe(() => truncateTable(arg1), `Table ${arg1} truncated`);
            break;

          case 'rename':
            if (!arg1 || !arg2) return error('Usage: rename <old> <new>');
            await runSafe(() => renameTable(arg1, arg2), `Table renamed ${arg1} → ${arg2}`);
            break;

          case 'copy':
            if (!arg1 || !arg2) return error('Usage: copy <source> <destination>');
            await runSafe(() => copyTable(arg1, arg2), `Table copied ${arg1} → ${arg2}`);
            break;

          case 'exists':
            if (!arg1) return error('Table name required');
            await runSafe(() => checkTableExists(arg1), `Checked existence of ${arg1}`);
            break;

          case 'describe':
            if (!arg1) return error('Table name required');
            await runSafe(() => describeTable(arg1), `Description for ${arg1}`);
            break;

          case 'count':
            if (!arg1) return error('Table name required');
            await runSafe(() => countRows(arg1), `Row count for ${arg1}`);
            break;

          default:
            error(`Unknown subcommand: ${sub}`);
            error('Available: list, create, drop, truncate, rename, copy, exists, describe, count');
        }
        break;
      }

      case 'migrate':
        if (args[1] === 'all') {
          await runSafe(migrateAll, 'All migrations applied');
        } else {
          error('Usage: mwala migrate all');
        }
        break;

      case 'rollback':
        if (args[1] === 'last') {
          await runSafe(rollbackLastMigration, 'Last migration rolled back');
        } else if (args[1] === 'all') {
          if (readlineSync.keyInYNStrict('⚠️  Really rollback ALL migrations? This is dangerous!')) {
            await runSafe(dropAllTables, 'All tables dropped (full rollback)');
          }
        } else {
          error('Usage: mwala rollback last | all');
        }
        break;

       case 'db:seed': {
  const file = args[1];

  if (!file) {
    return error('Seed file required: mwala db:seed <file.js>');
  }

  await runSafe(
    () => imports.seedDatabase(file),
    `Seed executed: ${file}`
  );

  break;
}

case 'db:backup': {
  const name = args[1]; // 👈 HII NDIO IMPORTANT

  await runSafe(
    () => imports.backupDatabase({ name }),
    'Database backup created'
  );
  break;
}

case 'db:restore': {
  const file = args[1];

  if (!file) {
    return error('Backup file required: mwala db:restore <file.sql>');
  }

  await runSafe(
    () => imports.restoreDatabase(file),
    `Database restored from ${file}`
  );

  break;
}

      // case 'db:backup':
      //   await runSafe(backupDatabase, 'Database backup created');
      //   break;

      // case 'db:restore':
      //   if (!args[1]) return error('Backup file required');
      //   await runSafe(() => restoreDatabase(args[1]), 'Database restored');
      //   break;

   case 'db:export': {
  if (!args[1] || !args[2]) {
    return error('Usage: db:export <table> <file.(csv|json|sql)>');
  }

  const table = args[1];
  const file = args[2];
  const ext = path.extname(file).toLowerCase();

  if (ext === '.csv') {
    await runSafe(() => exportTableToCsv(table, file), 'Table exported to CSV');
  } 
  else if (ext === '.json') {
    await runSafe(() => exportTableToJson(table, file), 'Table exported to JSON');
  } 
  else if (ext === '.sql') {
    await runSafe(() => exportTableToSql(table, file), 'Table exported to SQL');
  } 
  else {
    error('Unsupported file type. Use .csv, .json, or .sql');
  }

  break;
}


    case 'db:import': {
  if (!args[1] || !args[2]) {
    return error('Usage: db:import <file.(csv|json|sql)> <table>');
  }

  const file = args[1];
  const table = args[2];
  const ext = path.extname(file).toLowerCase();

  if (ext === '.csv') {
    await runSafe(() => importCsvToTable(file, table), 'CSV imported');
  } 
  else if (ext === '.json') {
    await runSafe(() => importJsonToTable(file, table), 'JSON imported');
  } 
  else if (ext === '.sql') {
    await runSafe(() => importSqlToTable(file), 'SQL imported');
  } 
  else {
    error('Unsupported file type. Use .csv, .json, or .sql');
  }

  break;
}


      case 'db:size':
        await runSafe(showDatabaseSize, 'Database size shown');
        break;

      case 'db:indexes':
        if (!args[1]) return error('Table name required');
        await runSafe(() => listIndexes(args[1]), `Indexes for ${args[1]}`);
        break;

      case 'db:analyze':
        if (!args[1]) return error('Table name required');
        await runSafe(() => analyzeTable(args[1]), `Table ${args[1]} analyzed`);
        break;

      case 'db:reindex':
        if (!args[1]) return error('Table name required');
        await runSafe(() => reindexTable(args[1]), `Table ${args[1]} reindexed`);
        break;

      case 'db:vacuum':
        await runSafe(vacuumDatabase, 'Database vacuumed');
        break;

      case 'db:connections':
        await runSafe(showConnections, 'Active connections shown');
        break;

      case 'db:kill-connections':
        if (readlineSync.keyInYNStrict('⚠️  Kill ALL other database connections?')) {
          await runSafe(killConnections, 'Other connections killed');
        }
        break;

      case 'db:drop-all-tables':
        if (readlineSync.keyInYNStrict('⚠️⚠️  THIS WILL DROP **ALL** TABLES! Continue?')) {
          await runSafe(dropAllTables, 'All tables dropped (irreversible!)');
        }
        break;

      default:
        error(`Unknown command: ${command}`);
        info('Run "mwala help" to see available commands.');
        process.exit(1);
    }
  } catch (topLevelErr) {
    error(`Unexpected CLI error: ${topLevelErr.message}`);
    console.error(colors.dim + topLevelErr.stack + colors.reset);
    process.exit(1);
  }
})();