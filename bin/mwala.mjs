#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getDbConnection } from '../config/createdatabase.mjs';
import { createTable, dropTable, migrateAll } from '../runMigrations.mjs';

const args = process.argv.slice(2);
const command = args[0];

// Helper functions
const createDirectories = (dirs) => {
  dirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), 'src', dir);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  });
};

const createFile = (filePath, content) => {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  fs.writeFileSync(filePath, content);
};

// Command Handling
switch (command) {
  case 'create':
    const projectName = args[1];
    if (!projectName) return console.error('Please provide a project name');
    
    const projectPath = path.join(process.cwd(), projectName);
    if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath);

    createDirectories(['src', 'src/controllers', 'src/models', 'src/routes', 'src/views', 'src/public', 'src/middlewares']);
    
    const defaultFiles = [
      { path: 'src/app.mjs', content: `import mwalajs from 'mwalajs';\nimport { homeRoutes } from './routes/homeRoutes.mjs';\nimport path from 'path';\nmwalajs.set('view engine', 'ejs');\nmwalajs.set('views', path.join(process.cwd(), 'src/views'));\nmwalajs.static(path.join(process.cwd(), 'src/public'));\nmwalajs.use('/', homeRoutes);\nmwalajs.listen(3000, () => console.log('Server running on http://localhost:3000'));` },
      { path: 'src/views/index.ejs', content: `<!DOCTYPE html>\n<html><head><title><%= title %></title></head><body><h1>Welcome to MwalaJS</h1></body></html>` },
      { path: 'src/controllers/homeController.mjs', content: `export const homeController = { getHomePage: (req, res) => res.render('index', { title: 'Welcome to MwalaJS' }) };` },
      { path: 'src/routes/homeRoutes.mjs', content: `import mwalajs from 'mwalajs';\nimport { homeController } from '../controllers/homeController.mjs';\nconst router = mwalajs.Router();\nrouter.get('/', homeController.getHomePage);\nexport { router as homeRoutes };` }
    ];
    
    defaultFiles.forEach(file => createFile(path.join(projectPath, file.path), file.content));
    console.log(`MVC project "${projectName}" created successfully`);
    break;

  case 'serve':
    execSync('node src/app.mjs', { stdio: 'inherit' });
    break;

  case 'generate':
    const type = args[1];
    const name = args[2];
    if (!type || !name) return console.log('❌ Please specify both type and name.');

    const paths = { model: 'models', controller: 'controllers', route: 'routes', view: 'views' };
    if (!paths[type]) return console.log('❌ Invalid type. Choose from model, controller, route, or view.');
    
    const content = type === 'model' ? `export const ${name}Model = {};` :
      type === 'controller' ? `export const ${name}Controller = { get${name}Page: (req, res) => res.render('${name}', { title: '${name}' }) };` :
      type === 'route' ? `import mwalajs from 'mwalajs';\nimport { ${name}Controller } from '../controllers/${name}Controller.mjs';\nconst router = mwalajs.Router();\nrouter.get('/', ${name}Controller.get${name}Page);\nexport { router as ${name}Route };` :
      `<!DOCTYPE html>\n<html><head><title>${name}</title></head><body><h1>${name} Page</h1></body></html>`;
    
    createFile(path.join(process.cwd(), 'src', paths[type], `${name}.mjs`), content);
    console.log(`${name} ${type} created successfully.`);
    break;

  case 'add':
    if (args[1] === 'middleware' && args[2]) {
      const middlewarePath = path.join(process.cwd(), 'src/middlewares', `${args[2]}.mjs`);
      createFile(middlewarePath, `export const ${args[2]} = (req, res, next) => next();`);
      console.log(`${args[2]} middleware created successfully.`);
    }
    break;

  case 'help':
    console.log(`Available commands:\n - create <appname>\n - serve\n - generate <model/controller/route/view> <name>\n - add middleware <name>\n - db create-database/migrate/rollback\n - create-table <table_name>\n - drop-table <table_name>`);
    break;

  case 'db':
    if (args[1] === 'create-database') {
      getDbConnection().then(() => console.log('Database created successfully.')).catch(err => console.error(`❌ ${err.message}`));
    }
    break;

  case 'create-table':
    if (!args[1]) return console.error('❌ Please specify a table name.');
    createTable(args[1]);
    break;

  case 'drop-table':
    if (!args[1]) return console.error('❌ Please specify a table name.');
    dropTable(args[1]);
    break;

  default:
    console.log('❌ Unknown command. Use "help" for a list of commands.');
}
