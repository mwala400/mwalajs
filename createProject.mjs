// createProject.mjs
import fs from "fs-extra";
import path from "path";
import readline from "readline";
import os from "os";

/**
 * Get template source safely
 */
function getMwalajsPath() {
  const envPath = process.env.MWALAJSPATH;

  const defaultPaths = [
    envPath,
    "C:\\Program Files\\mwalajs",
    "/usr/local/lib/mwalajs",
    "/var/www/mwalajs",
    path.join(process.cwd(), "template") // fallback local dev template
  ];

  for (const p of defaultPaths) {
    if (p && fs.existsSync(p)) return p;
  }

  return null; // IMPORTANT: we will generate manual scaffold
}

/**
 * Ask CLI input
 */
function ask(rl, q) {
  return new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));
}

/**
 * Manual fallback template generator (VERY IMPORTANT FIX)
 */
function createManualTemplate(target) {
  console.log("⚠ No template found. Creating manual MwalaJS scaffold...");

  const structure = [
    "controllers",
    "routes",
    "models",
    "views",
    "views/layouts",
    "views/pages",
    "middlewares",
    "migrations",
    "public/css",
    "public/js",
    "public/images"
  ];

  structure.forEach((dir) => {
    fs.mkdirSync(path.join(target, dir), { recursive: true });
  });

  // app.mjs
  fs.writeFileSync(
    path.join(target, "app.mjs"),
`import mwalajs from 'mwalajs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mwalajs.set('view engine', 'ejs');
mwalajs.set('views', path.join(__dirname, 'views'));
mwalajs.useStatic(path.join(__dirname, 'public'));

mwalajs.get('/', (req, res) => {
  res.render('pages/index', { title: 'MwalaJS App' });
});

const port = process.env.PORT || 3000;
mwalajs.listen(port, () => {
  console.log('🚀 Server running on http://localhost:' + port);
});
`
  );

  // sample controller
  fs.writeFileSync(
    path.join(target, "controllers/homeController.mjs"),
`export const homeController = {
  getHome: (req, res) => {
    res.render('pages/index', { title: 'Home Page' });
  }
};`
  );

  // sample route
  fs.writeFileSync(
    path.join(target, "routes/homeRoutes.mjs"),
`import mwalajs from 'mwalajs';
import { homeController } from '../controllers/homeController.mjs';

const router = mwalajs.Router();

router.get('/', homeController.getHome);

export { router as homeRoutes };
`
  );

  // sample view
  fs.writeFileSync(
    path.join(target, "views/pages/index.ejs"),
`<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
  <style>
    body { font-family: Arial; background:#0f172a; color:white; text-align:center; padding:50px; }
    .card { background:#1e293b; padding:20px; border-radius:12px; display:inline-block; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🚀 Welcome to MwalaJS</h1>
    <p><%= title %></p>
  </div>
</body>
</html>`
  );

  // package.json
  fs.writeFileSync(
    path.join(target, "package.json"),
`{
  "name": "mwalajs-app",
  "type": "module",
  "scripts": {
    "start": "node app.mjs"
  },
  "dependencies": {
    "mwalajs": "*"
  }
}`
  );

  fs.writeFileSync(
    path.join(target, "README.md"),
`# MwalaJS App

Run:
npm install
npm start
`
  );

  console.log("✅ Manual template created successfully!");
}

/**
 * Main project creator
 */
export async function createProject(projectArg) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    let projectName = projectArg?.trim();

    if (!projectName) {
      projectName = await ask(rl, "Enter project name: ");
    }

    if (!projectName) {
      console.log("❌ Project name required");
      return;
    }

    const target = path.join(process.cwd(), projectName);

    if (fs.existsSync(target)) {
      console.log("❌ Folder already exists");
      return;
    }

    fs.mkdirSync(target, { recursive: true });

    const templatePath = getMwalajsPath();

    if (!templatePath) {
      createManualTemplate(target);
    } else {
      console.log("📦 Using template from:", templatePath);

      const items = [
        "controllers",
        "routes",
        "models",
        "views",
        "middlewares",
        "migrations",
        "public",
        "app.mjs",
        "README.md"
      ];

      for (const item of items) {
        const src = path.join(templatePath, item);
        const dest = path.join(target, item);

        if (fs.existsSync(src)) {
          fs.copySync(src, dest);
          console.log("✔ copied:", item);
        } else {
          console.log("⚠ missing:", item);
        }
      }

      // fallback if empty project
      if (!fs.existsSync(path.join(target, "app.mjs"))) {
        createManualTemplate(target);
      }
    }

    console.log("\n🎉 Project created successfully!");
    console.log("📁 Path:", target);

  } catch (err) {
    console.error("❌ Create project failed:", err.message);
  } finally {
    rl.close();
  }
}

// CLI support
if (import.meta.url === `file://${process.argv[1]}`) {
  createProject(process.argv[2]);
}