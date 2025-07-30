
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

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help' || command === 'h') {
  console.log(`
  MwalaJS CLI - List of Commands:

  General:
  - mwala -v | --version        → Show the version.
  - mwala help | h              → Show this help.

  Project Management:
  - mwala create-project        → Create a new MwalaJS project.
  - mwala init                  → Initialize MwalaJS.

  Running App:
  - mwala serve | app.mjs       → Start the MwalaJS application.

  Database:
  - mwala create-db             → Create the database.
  - mwala create-table <name>   → Create a table.
  - mwala drop-table <name>     → Drop a table.
  - mwala migrate all           → Run all migrations.
  - mwala rollback all          → Roll back last migration.

  Code Generation:
  - mwala generate model <name>
  - mwala generate controller <name>
  - mwala generate route <name>
  - mwala generate view <name>
  - mwala generate midware <name>
  `);
  process.exit(0);
}

switch (command) {
  case 'version':
  case '-v':
  case '--version':
    console.log('MwalaJS Version: 1.0.0');
    process.exit(0);

  case 'create-project':
    console.log('Project creation logic goes here.');
    // await createProject(); // Uncomment when implemented
    break;

  case 'serve':
  case 'app.mjs':
    try {
      execSync('node app.mjs', { stdio: 'inherit' });
    } catch (err) {
      console.error(`Failed to start app: ${err.message}`);
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
      console.error('Specify both type and name: mwala generate <type> <name>');
      process.exit(1);
    }

    const map = {
      model: 'models',
      controller: 'controllers',
      route: 'routes',
      view: 'views',
      midware: 'middlewares'
    };

    if (!map[subCommand]) {
      console.error(`Unknown type '${subCommand}'. Use: ${Object.keys(map).join(', ')}`);
      process.exit(1);
    }

    const filePath = path.join(process.cwd(), map[subCommand], `${name}.mjs`);
    if (fs.existsSync(filePath)) {
      console.log(`${subCommand} "${name}" already exists.`);
      process.exit(1);
    }

    const templates = {
      model: `export const ${name}Model = {};`,
      controller: `export const ${name}Controller = { get${name}Page: (req, res) => res.render('${name}', { title: '${name} Page' }) };`,
      route: `import mwalajs from 'mwalajs';\nimport { ${name}Controller } from '../controllers/${name}Controller.mjs';\nconst router = mwalajs.Router();\nrouter.get('/', ${name}Controller.get${name}Page);\nexport { router as ${name}Route };`,
      view: `<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>${name} Page</title></head>\n<body>\n<h1>${name} View Page</h1>\n</body>\n</html>`,
      midware: `export const ${name} = (req, res, next) => { next(); };`
    };

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, templates[subCommand]);
    console.log(`${subCommand} "${name}" created at ${filePath}`);
    break;
  }

  case 'create-db':
    getDbConnection().then(() => console.log('Database created.')).catch(err => {
      console.error(`Database error: ${err.message}`);
      process.exit(1);
    });
    break;

  case 'create-table':
    if (!args[1]) {
      console.error('Specify table name.');
      process.exit(1);
    }
    createTable(args[1]);
    break;

  case 'drop-table':
    if (!args[1]) {
      console.error('Specify table name.');
      process.exit(1);
    }
    dropTable(args[1]);
    break;

  case 'migrate':
    if (args[1] === 'all') {
      migrateAll();
    } else {
      console.error('Use: mwala migrate all');
      process.exit(1);
    }
    break;

  case 'rollback':
    if (args[1] === 'all') {
      rollbackLastMigration();
    } else {
      console.error('Use: mwala rollback all');
      process.exit(1);
    }
    break;

  default:
    console.error(`Unknown command: "${command}". Run "mwala help" for options.`);
    process.exit(1);
}
