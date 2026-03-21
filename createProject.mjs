// createProject.mjs (ULTIMATE CROSS-PLATFORM VERSION)

import fs from "fs-extra";
import path from "path";
import readline from "readline";
import os from "os";
import { fileURLToPath } from "url";

/* =========================
   SAFE PATH HELPERS
========================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Detect best possible MwalaJS template path
 * Works on ALL OS
 */
function getMwalajsPath() {
  const envPath = process.env.MWALAJSPATH;

  const possiblePaths = [
    envPath,
    path.join(process.cwd(), "template"),
    path.join(__dirname, "template"),
    path.join(__dirname, "../template"),
    path.join(__dirname, "../../template"),
    "C:\\Program Files\\mwalajs",
    "C:\\mwalajs",
    "/usr/local/lib/mwalajs",
    "/usr/lib/mwalajs",
    "/var/www/mwalajs",
    "/opt/mwalajs"
  ];

  for (const p of possiblePaths) {
    if (p && fs.existsSync(p)) {
      return fs.realpathSync(p);
    }
  }

  return null;
}

/* =========================
   CLI INPUT
========================= */

function ask(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (ans) => resolve(ans.trim()));
  });
}

/* =========================
   MANUAL TEMPLATE GENERATOR
   (ALWAYS WORKS - FALLBACK)
========================= */

function createManualTemplate(target) {
  console.log("\n⚠ No template found. Generating FULL MwalaJS scaffold...\n");

  const dirs = [
    "controllers",
    "routes",
    "models",
    "views",
    "views/layouts",
    "views/pages",
    "middlewares",
    "migrations",
    "config",
    "public",
    "public/css",
    "public/js",
    "public/images",
    "storage",
    "logs"
  ];

  dirs.forEach((dir) => {
    fs.mkdirSync(path.join(target, dir), { recursive: true });
  });

  /* =========================
     APP ENTRY
  ========================= */

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

/* ROUTES */
mwalajs.get('/', (req, res) => {
  res.render('pages/index', {
    title: '🚀 MwalaJS Application Running'
  });
});

/* SERVER */
const PORT = process.env.PORT || 3000;
mwalajs.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`
  );

  /* =========================
     CONTROLLER
  ========================= */

  fs.writeFileSync(
    path.join(target, "controllers/homeController.mjs"),
`export const homeController = {
  index: (req, res) => {
    res.render('pages/index', {
      title: 'Home Page'
    });
  }
};`
  );

  /* =========================
     ROUTES
  ========================= */

  fs.writeFileSync(
    path.join(target, "routes/homeRoutes.mjs"),
`import mwalajs from 'mwalajs';
import { homeController } from '../controllers/homeController.mjs';

const router = mwalajs.Router();

router.get('/', homeController.index);

export { router as homeRoutes };
`
  );

  /* =========================
     MODEL EXAMPLE
  ========================= */

  fs.writeFileSync(
    path.join(target, "models/User.mjs"),
`export class User {
  constructor() {
    this.table = "users";
  }

  // Add model logic here
}
`
  );

  /* =========================
     VIEW
  ========================= */

  fs.writeFileSync(
    path.join(target, "views/pages/index.ejs"),
`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title><%= title %></title>
  <style>
    body {
      font-family: Arial;
      background: linear-gradient(135deg,#0f172a,#1e293b);
      color: white;
      text-align: center;
      padding: 60px;
    }

    .box {
      background: rgba(255,255,255,0.05);
      padding: 30px;
      border-radius: 16px;
      display: inline-block;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    h1 {
      font-size: 40px;
    }
  </style>
</head>
<body>
  <div class="box">
    <h1>🚀 MwalaJS Ready</h1>
    <p><%= title %></p>
  </div>
</body>
</html>`
  );

  /* =========================
     PACKAGE JSON
  ========================= */

  fs.writeFileSync(
    path.join(target, "package.json"),
`{
  "name": "mwalajs-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node app.mjs"
  },
  "dependencies": {
    "mwalajs": "*",
    "ejs": "*"
  }
}`
  );

  /* =========================
     README
  ========================= */

  fs.writeFileSync(
    path.join(target, "README.md"),
`# 🚀 MwalaJS Project

## Run project

npm install
npm start

## Structure
- MVC architecture
- Controllers
- Routes
- Models
- Views
`
  );

  console.log("✅ FULL manual scaffold created successfully!");
}

/* =========================
   MAIN PROJECT CREATOR
========================= */

export async function createProject(projectArg) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let createdMode = "unknown";

  try {
    let projectName = projectArg?.trim();

    if (!projectName) {
      projectName = await ask(rl, "Enter project name: ");
    }

    if (!projectName) {
      console.log("❌ Project name is required");
      return;
    }

    const target = path.join(process.cwd(), projectName);

    if (fs.existsSync(target)) {
      console.log("❌ Folder already exists");
      return;
    }

    fs.mkdirSync(target, { recursive: true });

    const templatePath = getMwalajsPath();

    /* =========================
       TEMPLATE MODE
    ========================= */

    if (templatePath) {
      console.log("📦 Template found:", templatePath);

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

      let copied = 0;

      for (const item of items) {
        const src = path.join(templatePath, item);
        const dest = path.join(target, item);

        if (fs.existsSync(src)) {
          fs.copySync(src, dest);
          console.log("✔ copied:", item);
          copied++;
        } else {
          console.log("⚠ missing:", item);
        }
      }

      if (copied === 0) {
        console.log("⚠ Template empty → switching to manual mode...");
        createManualTemplate(target);
        createdMode = "manual";
      } else {
        createdMode = "template";
      }

    } else {
      /* =========================
         MANUAL MODE
      ========================= */

      createManualTemplate(target);
      createdMode = "manual";
    }

    /* =========================
       FINAL OUTPUT (NO FAKE SUCCESS)
    ========================= */

    console.log("\n============================");
    console.log("🎉 PROJECT CREATED SUCCESSFULLY");
    console.log("============================");
    console.log("📁 Path:", target);
    console.log("⚙ Mode:", createdMode.toUpperCase());
    console.log("============================\n");

  } catch (err) {
    console.error("❌ Create project failed:", err.message);
  } finally {
    rl.close();
  }
}

/* =========================
   CLI EXECUTION
========================= */

if (import.meta.url === `file://${process.argv[1]}`) {
  createProject(process.argv[2]);
}