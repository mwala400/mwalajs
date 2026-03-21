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
// let setupMwalajs, createProject, dropAllTables, getDbConnection;
let {
  setupMwalajs,
  createProject,
  dropAllTables,
  getDbConnection,
  listTables,
  createTable,
  dropTable,
  migrateAll,
  rollbackLastMigration,
showDatabaseSize,
  listIndexes,
  analyzeTable,
  vacuumDatabase,
  showConnections,
  killConnections,
} = imports;

try {
  const [
    dbCfg,
    migrations,
    setup,
    proj,
    dbUtilsRaw,
    maintenance,
  ] = await Promise.all([
    import(pathToFileURL(path.join(__dirname, '../config/createdatabase.mjs')).href),
    import(pathToFileURL(path.join(__dirname, '../runMigrations.mjs')).href),
    import(pathToFileURL(path.join(__dirname, '../setupMwalajs.mjs')).href),
    import(pathToFileURL(path.join(__dirname, '../createProject.mjs')).href),
    import(pathToFileURL(path.join(__dirname, '../config/dbUtils.mjs')).href),
  ]);

  const normalize = (mod) => mod?.default ?? mod ?? {};

  imports = {
    ...normalize(dbCfg),
    ...normalize(migrations),
    ...normalize(setup),
    ...normalize(proj),
    ...normalize(dbUtilsRaw),
    ...normalize(maintenance),     // ← important
  };

  // 🔥 IMPORTANT FIX
({
  setupMwalajs,
  createProject,
  dropAllTables,
  getDbConnection,
  listTables,
  createTable,
  dropTable,
  migrateAll,
  rollbackLastMigration,
  // ongeza hizi zingine ukizihitaji baadaye
  showDatabaseSize,
  listIndexes,
  analyzeTable,
  vacuumDatabase,
  showConnections,
  killConnections,
  // n.k.
} = imports);

  
} catch (err) {
  error(`Failed to load required modules:\n${err.stack || err.message}`);
  process.exit(1);
}
const args = process.argv.slice(2);
const command = args[0]?.toLowerCase();


if (!command || command === 'help' || command === 'h') {
  console.clear();

  const reset  = '\x1b[0m';
  const bright = '\x1b[1m';
  const cyan   = '\x1b[36m';
  const yellow = '\x1b[33m';
  const green  = '\x1b[32m';
  const blue   = '\x1b[34m';
  const magenta= '\x1b[35m';
  const red    = '\x1b[31m';
  const gray   = '\x1b[90m';

  const line   = `${gray}────────────────────────────────────────────────────────────${reset}`;
  const boxTop = `${bright}╔════════════════════════════════════════════════════════════╗${reset}`;
  const boxBot = `${bright}╚════════════════════════════════════════════════════════════╝${reset}`;

  console.log(`

${bright}╔════════════════════════════════════════════════════╗${reset}
${bright}║             MwalaJS CLI v${pkg.version}            ║${reset}
${bright}╚════════════════════════════════════════════════════╝${reset}

${cyan}

███╗   ███╗ ██╗    ██╗ █████╗ ██╗      █████╗        ██╗ ███████╗
████╗ ████║ ██║    ██║██╔══██╗██║     ██╔══██╗       ██║██╔════╝
██╔████╔██║ ██║ █╗ ██║███████║██║     ███████║       ██║███████╗
██║╚██╔╝██║ ██║███╗██║██╔══██║██║     ██╔══██║  ██   ██║╚════██║
██║ ╚═╝ ██║ ╚███╔███╔╝██║  ██║███████╗██║  ██║  ╚█████╔╝███████║
╚═╝     ╚═╝  ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚════╝ ╚══════╝

${reset}

${bright}MwalaJS CLI v${pkg.version}${reset}
${gray}Build • Automate • Deploy • Learn • Scale${reset}

${line}

${boxTop}
${bright}║               CORE COMMANDS                                ║${reset}
${boxBot}

  ${yellow}mwala -v | --version${reset}     Show version
  ${yellow}mwala help | h${reset}           Show this help menu
  ${yellow}mwala init${reset}               Initialize a new project
  ${yellow}mwala serve${reset}              Run app locally

${line}

${boxTop}
${bright}║             PROJECT SCAFFOLDING (🏗️)                      ║${reset}
${boxBot}

  ${green}mwala create-project${reset}
  ${green}mwala generate model${reset}      <name>
  ${green}mwala generate controller${reset} <name>
  ${green}mwala generate route${reset}      <name>
  ${green}mwala generate view${reset}       <name>
  ${green}mwala generate middleware${reset} <name>

${line}

${boxTop}
${bright}║                  DATABASE CORE (🗄️)                        ║${reset}
${boxBot}

  ${blue}mwala create-db${reset}
  ${blue}mwala db:config${reset}

  ${gray}→ Tables:${reset}
    ${blue}mwala db:table list${reset}
    ${blue}mwala db:table create${reset} <name>
    ${blue}mwala db:table drop${reset}   <name>
    ${blue}mwala db:table rename${reset} <old> <new>
    ${blue}mwala db:table copy${reset}   <src> <dest>

${line}

${boxTop}
${bright}║               MIGRATION SYSTEM                         ║${reset}
${boxBot}

  ${magenta}mwala migrate all${reset}
  ${magenta}mwala rollback last${reset}
  ${magenta}mwala rollback all${reset}    ${red}⚠ destructive operation${reset}

${line}

${boxTop}
${bright}║                   DATA FLOW (📦)                           ║${reset}
${boxBot}

  ${cyan}Import:${reset}
    ${cyan}mwala db:import${reset} users.csv users
    ${cyan}mwala db:import${reset} backup.sql users

  ${cyan}Export:${reset}
    ${cyan}mwala db:export${reset} users users.json

  ${gray}Tip:${reset} CSV/JSON = data only • SQL = structure + data

${line}

${boxTop}
${bright}║                BACKUP & SEEDING                        ║${reset}
${boxBot}

  ${red}mwala db:seed${reset} <file.js>
  ${red}mwala db:backup${reset} [custom-name]
  ${red}mwala db:restore${reset} <file.sql>

  Example:
    ${red}mwala db:backup${reset} prod-2026-03-21

${line}

${boxTop}
${bright}║               MAINTENANCE TOOLS (🛠)                       ║${reset}
${boxBot}

  ${yellow}mwala db:size${reset}
  ${yellow}mwala db:indexes${reset} <table>
  ${yellow}mwala db:analyze${reset} <table>
  ${yellow}mwala db:vacuum${reset}
  ${yellow}mwala db:connections${reset}
  ${yellow}mwala db:kill-connections${reset}   ${red}⚠ admin only${reset}

${line}

${boxTop}
${bright}║                  DEVELOPER NOTES                        ║${reset}
${boxBot}

  • Use meaningful backup names (date + description)
  • Avoid rollback all in production
  • Prefer SQL for full migrations
  • Use CSV/JSON for fast data sync

${line}

${bright} MWALAJS — Control. Simplicity. Power.${reset}
${gray}“Built for developers who hate complexity”${reset}

${line}

${green}Happy Coding — Build like a pro, no stress!${reset}

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
  await runSafe(async () => {
    await createProject(args[1]);
  }, 'Project created successfully');
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


      // case 'db:size':
      //   await runSafe(showDatabaseSize, 'Database size shown');
      //   break;

      // case 'db:indexes':
      //   if (!args[1]) return error('Table name required');
      //   await runSafe(() => listIndexes(args[1]), `Indexes for ${args[1]}`);
      //   break;

      // case 'db:analyze':
      //   if (!args[1]) return error('Table name required');
      //   await runSafe(() => analyzeTable(args[1]), `Table ${args[1]} analyzed`);
      //   break;

      // case 'db:reindex':
      //   if (!args[1]) return error('Table name required');
      //   await runSafe(() => reindexTable(args[1]), `Table ${args[1]} reindexed`);
      //   break;

      // case 'db:vacuum':
      //   await runSafe(vacuumDatabase, 'Database vacuumed');
      //   break;

      // case 'db:connections':
      //   await runSafe(showConnections, 'Active connections shown');
      //   break;


      case 'db:size':
  await runSafe(() => imports.showDatabaseSize(), 'Database size shown');
  break;

case 'db:indexes':
  if (!args[1]) return error('Table name required: mwala db:indexes <table>');
  await runSafe(() => imports.listIndexes(args[1]), `Indexes for ${args[1]}`);
  break;

case 'db:analyze':
  if (!args[1]) return error('Table name required');
  await runSafe(() => imports.analyzeTable(args[1]), `Table ${args[1]} analyzed`);
  break;

case 'db:vacuum':
  await runSafe(() => imports.vacuumDatabase(), 'Database vacuumed');
  break;

case 'db:connections':
  await runSafe(() => imports.showConnections(), 'Active connections shown');
  break;

case 'db:kill-connections':
  if (readlineSync.keyInYNStrict('⚠️ Kill ALL other database connections? (hatari!)')) {
    await runSafe(() => imports.killConnections(), 'Other connections killed');
  }
  break;

      // case 'db:kill-connections':
      //   if (readlineSync.keyInYNStrict('⚠️  Kill ALL other database connections?')) {
      //     await runSafe(killConnections, 'Other connections killed');
      //   }
      //   break;

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