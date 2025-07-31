#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically import modules using relative paths
const { getDbConnection } = await import(pathToFileURL(path.join(__dirname, '../config/createdatabase.mjs')).href);
const { createTable, dropTable, migrateAll, rollbackLastMigration } = await import(pathToFileURL(path.join(__dirname, '../runMigrations.mjs')).href);
const { setupMwalajs } = await import(pathToFileURL(path.join(__dirname, '../setupMwalajs.mjs')).href);
const { createProject  } = await import(pathToFileURL(path.join(__dirname, '../createProject.mjs')).href);

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === 'h') {
  console.log(`
    MwalaJS CLI - List of Commands:

  General Commands:
  - mwala -v | mwala --version → Show the MwalaJS version.
  - mwala help | mwala h       → Show this help message.

  Project Management:
  - mwala create-project       → Create a new MwalaJS project.
  - mwala init                 → Initialize MwalaJS in the current project.

  Running the Application:
  - mwala serve | mwala app.mjs → Start the MwalaJS application.

  Database Operations:
  - mwala create-db            → Create the database specified in the .env file.
  - mwala create-table <name>  → Create a specific database table.
  - mwala drop-table <name>    → Drop a specific database table.
  - mwala migrate all          → Run all pending migrations.

  Code Generation:
  - mwala generate model <name>       → Create a new model.
  - mwala generate controller <name>  → Create a new controller.
  - mwala generate route <name>       → Create a new route.
  - mwala generate view <name>        → Create a new view file.
  - mwala generate midware <name>     → Create a new middleware.

   Use "mwala <command>" to execute a command.
  `);
  process.exit(0);
}

switch (command) {
  case 'version':
  case '-v':
  case 'v':
  case '--version':
    console.log('MwalaJS Version: 1.0.5');
    process.exit(0);

  case 'create-project':
    createProject();
    break;

  case 'serve':
  case 'app.mjs':
    try {
      execSync('node app.mjs', { stdio: 'inherit' });
    } catch (error) {
      console.error(` Failed to run the app: ${error.message}`);
      process.exit(1);
    }
    break;

  case 'init':
    setupMwalajs();
    break;

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

    const filePath = path.join(process.cwd(), paths[subCommand], `${name}.mjs`);

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
        content = `import mwalajs from 'mwalajs';\nimport { ${name}Controller } from '../controllers/${name}Controller.mjs';\nconst router = mwalajs.Router();\nrouter.get('/', ${name}Controller.get${name}Page);\nexport { router as ${name}Route };`;
        break;
      case 'view':
        content = `<!DOCTYPE html>\n<html lang='en'>\n<head>\n  <meta charset='UTF-8'>\n  <title>${name} Page</title>\n</head>\n<body>\n  <h1>${name} View Page</h1>\n</body>\n</html>`;
        break;
      case 'midware':
        content = `export const ${name} = (req, res, next) => { next(); };`;
        break;
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
    console.log(` ${name} ${subCommand} created successfully in ${paths[subCommand]}/.`);
    break;
  }

  case 'create-db':
    getDbConnection().then(() => console.log('Database created.')).catch(err => {
      console.error(` Failed to create database: ${err.message}`);
      process.exit(1);
    });
    break;

  case 'create-table':
    if (!args[1]) {
      console.error(' Please specify a table name.');
      process.exit(1);
    }
    createTable(args[1]);
    break;

  case 'drop-table':
    if (!args[1]) {
      console.error(' Please specify a table name.');
      process.exit(1);
    }
    dropTable(args[1]);
    break;

  case 'migrate':
    if (args[1] === 'all') {
      migrateAll();
    } else {
      console.error(' Invalid migration command. Use: mwala migrate all');
      process.exit(1);
    }
    break;
    case 'rollback':
    if (args[1] === 'all') {
   
      rollbackLastMigration();
    } else {
      console.error(' Invalid migration command. Use: mwala roll-back all');
      process.exit(1);
    }
    break;

  default:
    console.error(` Unknown command: ${command}. Run "mwala help" to see available commands.`);
    process.exit(1);
}
