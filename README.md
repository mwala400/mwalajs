Here's a list of all useful commands for MwalaJS:

General Commands:
mwala -v or mwala --version → Show the MwalaJS version.
mwala help → Show all available commands and their descriptions.
Project Management:
mwala create-project → Create a new MwalaJS project.
mwala init → Initialize MwalaJS in the current project.
Running the Application:
mwala serve or mwala app.mjs → Start the MwalaJS application.
Database Operations:
mwala create-db → Create the database specified in the .env file.
mwala create-table <table_name> → Create a specific database table.
mwala drop-table <table_name> → Drop a specific database table.
mwala migrate all → Run all pending migrations.
Code Generation:
mwala generate model <name> → Create a new model.
mwala generate controller <name> → Create a new controller.
mwala generate route <name> → Create a new route.
mwala generate view <name> → Create a new view file.
mwala generate midware <name> → Create a new middleware.
This list ensures you can efficiently manage your MwalaJS project, handle databases, and generate key components. Would you like to add a mwala help command to display this list in the CLI?







# mwalajs
# MwalaJS - The Next Evolution in Web Development

## Introduction
MwalaJS is a powerful and modern JavaScript framework designed to simplify web application development while offering high performance, scalability, and flexibility. Unlike traditional frameworks, MwalaJS introduces a new way of handling routing, state management, and database interactions.

## Why Choose MwalaJS?
###  High Performance
- Optimized for speed and efficiency
- Minimal memory usage
- Faster execution compared to traditional frameworks

###  Simplicity & Flexibility
- Easy to learn and use
- Clean and modular code structure
- Supports both small-scale and enterprise-level applications

###  Built-In Features
- Automatic API routing
- Integrated database management
- Scalable real-time processing
- Simple yet powerful templating engine

## Getting Started

### Installation
To install MwalaJS, use the following command:
```sh
npm install -g mwalajs
```

### Creating a New Project
To create a new MwalaJS project, run:
```sh
mwala create-project myApp
cd myApp
npm install
```

### Running the Application
Start the development server with:
```sh
mwala serve
```

## Example Application

### app.mjs
Here is an example of the default `app.mjs` file for starting the server:


git clone https://github.com/mwala400/mwalajs.git
![npm version](https://img.shields.io/npm/v/mwalajs)
![GitHub issues](https://img.shields.io/github/issues/mwala400/mwalajs)
![License](https://img.shields.io/github/license/mwala400/mwalajs)
# MwalaJS Framework

MwalaJS is a modern CLI tool and web framework  built on top of Javascript,Node.js and Express.js for powerful and fast backend and frontend development. It simplifies creating MVC applications, managing databases, and generating code scaffolding.

---

## Table of Contents

- [Features](#features)  
- [Requirements](#requirements)  
- [Installation](#installation)  
- [Setup](#setup)  
- [Usage](#usage)  
- [CLI Commands](#cli-commands)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- Lightweight Express.js wrapper with MVC pattern  
- CLI tool for project scaffolding and database management  
- Support for multiple databases: MongoDB, MySQL, PostgreSQL, SQLite  
- Built-in middleware integration (session, cors, helmet, compression)  
- Easy static file serving and routing  
- Code generation for models, controllers, routes, views, and middleware  
- Migration support for database schema changes  

---

## Requirements

- Node.js v18 or higher  
- npm (comes with Node.js)  
- Supported databases (MongoDB, MySQL, PostgreSQL, SQLite) installed and configured  

---

## Installation

Install MwalaJS globally via npm:

```bash
npm install -g mwalajs


```javascript
import mwalajs from 'mwalajs';
import { homeRoutes } from './routes/homeRoutes.mjs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mwalajs.set('view engine', 'ejs');
mwalajs.set('views', path.join(__dirname, 'views'));

mwalajs.useStatic(path.join(__dirname, 'public'));

mwalajs.use('/', homeRoutes);

const port = process.env.PORT || 3000;
mwalajs.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

### homeRoutes.mjs
Here is an example of the default `homeRoutes.mjs` file:

```javascript
import mwalajs from 'mwalajs';
import { homeController, Steps, welcome, about } from '../controllers/homeController.mjs';

const router = mwalajs.Router();

router.get('/', homeController.getHomePage);
router.get('/steps', Steps.getSteps);
router.get('/welcome', welcome.getwelcome);
router.get('/about', about.getabout);

export { router as homeRoutes };
```

### homeController.mjs
Here is an example of the default `homeController.mjs` file:

```javascript
export const homeController = {
  getHomePage: (req, res) => {
    res.render('index', { title: 'Welcome to MwalaJS MVC' });
  }
};

export const Steps = {
  getSteps: (req, res) => {
    res.render('steps', { title: 'Welcome to MwalaJS MVC' });
  }
};

export const welcome = {
  getwelcome: (req, res) => {
    res.render('welcome', { title: 'Welcome to MwalaJS MVC' });
  }
};

export const about = {
  getabout: (req, res) => {
    res.render('about', { title: 'Welcome to MwalaJS MVC' });
  }
};
```

## Summary

### MwalaJS CLI - List of Commands:

#### General Commands:
- `mwala -v` | `mwala --version` → Show the MwalaJS version.
- `mwala help` | `mwala h`       → Show this help message.

#### Project Management:
- `mwala create-project `       → Create a new MwalaJS project Then will request project name.
- `mwala init`                         → Initialize MwalaJS in the current project I N OLD VERSION .

#### Running the Application:
- `mwala serve` | `mwala app.mjs` → Start the MwalaJS application.

#### Database Operations:
- `mwala create-db`            → Create the database specified in the `.env` file.
- `mwala create-table <name>`  → Create a specific database table.
- `mwala drop-table <name>`    → Drop a specific database table.
- `mwala migrate all`          → Run all pending migrations.
- `mwala rollback all`         → Undo migration.

#### Code Generation:
- `mwala generate model <name>`       → Create a new model.
- `mwala generate controll
MwalaJS
Overview
Installation
Commands
Project Structure
Example Application
Conclusion
MwalaJS - Complete Documentation
Welcome to MwalaJS! This guide will help you install, configure, and use MwalaJS efficiently.

1. Installation
You can install MwalaJS in multiple ways:

Using GitHub Repository
Clone the repository from GitHub:

git clone https://github.com/mwala400/mwalajs.git

Using a ZIP, EXE, or RAR File 
Download and extract the files from the available compressed format:

ZIP: Extract using WinRAR or 7-Zip.
RAR: Extract using WinRAR.
EXE: Run the installer and follow the instructions.

1. VERSION RELEASE
Click below to download the installer For Mwalajs framework:



Click below to download zip file mwalajs framework:



Click below to download rar file mwalajs framework :



2. Setting Up MwalaJS if installed through .exe,zip or rar
Initialize MwalaJS
mwala init 
Creating a New Project
mwala create-project
3. Running the Application
mwala serve
4. Database Operations
Creating a Database
mwala create-db
Creating a Table
mwala create-table <table_name>
Dropping a Table
mwala drop-table <table_name>
5. Code Generation
            mwala generate model <name>
            mwala generate controller <name>
            mwala generate route <name>
            mwala generate view <name>
            mwala generate midware <name>
        
6. Additional Information
For more details, visit: GitHub Repository

MwalaJS Framework Documentation
A lightweight, easy-to-use Node.js framework to create scalable web applications with MVC architecture and powerful built-in features.

GitHub Repository: https://github.com/mwala400/mwalajs

1. Overview
MwalaJS is a lightweight, easy-to-use Node.js framework designed to help you create scalable and organized MVC-based web applications. It comes with built-in features for handling routing, models, views, middleware, and database operations.

Download Documentation

1. VERSION RELEASE
Click below to download the installer For Mwalajs framework:



Click below to download zip file mwalajs framework:



Click below to download rar file mwalajs framework :


git clone https://github.com/mwala400/mwalajs.git



Key Features:
MVC Architecture: Automatically generates models, controllers, routes, and views.
Database Management: Includes commands to create and drop tables, run migrations, and manage the database.
Middleware Support: Add custom middleware to handle requests.
EJS Template Engine: Integrated for view rendering.
Static File Support: Easily serve static assets like CSS, JavaScript, and images.
MwalaJS Docs
Examples
Conclusion
. Example Application
app.mjs
Here is an example of the default app.mjs file for starting the server:


    import mwalajs from 'mwalajs';
    import { homeRoutes } from './routes/homeRoutes.mjs';
    import { fileURLToPath } from 'url';
    import path from 'path';
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    mwalajs.set('view engine', 'ejs');
    mwalajs.set('views', path.join(__dirname, 'views'));
    
    mwalajs.static(path.join(__dirname, 'public'));
    
    mwalajs.use('/', homeRoutes);
    
    const port = process.env.PORT || 3000;
    mwalajs.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
            
homeRoutes.mjs
Here is an example of the default homeRoutes.mjs file:


    import mwalajs from 'mwalajs';
    import { homeController, Steps, welcome, about } from '../controllers/homeController.mjs';
    
    const router = mwalajs.constructor.Router();
    
    router.get('/', homeController.getHomePage);
    router.get('/steps', Steps.getSteps);
    router.get('/welcome', welcome.getwelcome);
    router.get('/about', about.getabout);
    
    export { router as homeRoutes };
            
homeController.mjs
Here is an example of the homeController.mjs file:


    export const homeController = {
      getHomePage: (req, res) => {
        res.render('index', { title: 'Welcome to MwalaJS MVC' });
      }
    };
    
    export const Steps = {
      getSteps: (req, res) => {
        res.render('steps', { title: 'Steps in MwalaJS MVC' });
      }
    };
    
    export const welcome = {
      getwelcome: (req, res) => {
        res.render('welcome', { title: 'Welcome to MwalaJS MVC' });
      }
    };
    
    export const about = {
      getabout: (req, res) => {
        res.render('about', { title: 'About MwalaJS MVC' });
      }
    };
            
6. Conclusion
MwalaJS is designed to streamline the development of MVC-based applications with its easy-to-use commands for setting up projects, generating components, and managing the database.

For full documentation and to contribute, visit the GitHub repository.

Summary of MwalaJS Commands
 General Commands:
      - mwala -v | mwala --version → Show MwalaJS version.
      - mwala help | mwala h → Show help message.
   Project Management:
      - mwala create-project → Create a new project.
      - mwala init → Initialize MwalaJS.
    
     Running the Application:
      - mwala serve | mwala app.mjs → Start MwalaJS app.
    
    🔹 Database Operations:
      - mwala create-db → Create database from .env file.
      - mwala migrate all → Run all pending migrations.
      - mwala rollback all → Undo migration.
    
    🔹 Code Generation:
      - mwala generate model  → Create a model.
      - mwala generate controller  → Create a controller.
      - mwala generate route  → Create a route.
      - mwala generate view  → Create a view.
    
    🔹 To execute a command, use:
      mwala 
            
mwalajs/ # Root directory
      mwalajs/               # Root directory
      │── app.mjs             # Main application file
      │── runMigrations.mjs   # Handles database migrations
      │── createProject.mjs   # Script for creating new projects
      │── setupMwalajs.mjs    # Setup script for MwalaJS
      │── start.bat           # Batch script to start the server
      │── setup.bat           # Batch script for installation
      │── setup.bash          # Bash script for installation (Linux/macOS)
      │── setup.sh            # Another installation script
      │── package.json        # Dependencies and project metadata
      │── package-lock.json   # Dependency lock file
      │── README.md           # Documentation for MwalaJS
      │── migrations/         # Database migration files
      │── models/             # Database models
      │── controllers/        # Handles application logic
      │── routes/             # Defines API routes
      │── middlewares/        # Custom middleware for authentication, logging, etc.
      │── config/             # Configuration files (e.g., database, app settings)
      │── public/             # Static assets like CSS, JavaScript, and images
      │── views/              # Template views (if using server-side rendering)
      │── mwalajs/            # Core framework files
      │── dist/               # Compiled or built files
      │── node_modules/       # Dependencies installed via npm
      │── YOUR CREATED PROJECT/       # When run mwala create-project will request project name related files (clarify purpose) 
      │── installer/          # Installation-related files
      │── installerimg.png    # Image used during installation
      │── mwalajs5.png        # Framework branding/image
      │── mwalajs4_RXv_icon.ico # Framework icons
      │── mwalajs4_lyh_icon.ico # Another framework icon
      │── mwalajsm.iss        # Installer script for Windows
      │── background.bmp      # Background image (possibly for setup UI)
      │── background.png      # Another background image
      │── bin/                # Executable files or scripts
      This structure makes MwalaJS a well-organized and scalable framework. To make it even more convincing, you could add:
      
      A "tests/" folder – To show built-in support for unit and integration tests.
      A "docs/" folder – Dedicated to documentation with detailed guides.
      A "scripts/" folder – For automation scripts instead of having them in the root directory.
      A "logs/" folder – To store logs instead of scattering them.
      

```
## Getting Started
### Installation
1. **Install MwalaJS globally:**
   ```sh
   npm install -g mwalajs
   ```
   OR Run
   mwala init
2. **Create a new project:**
   ```sh
   mwalajs create-project
   will request project name example myApp
   cd myApp
   npm install
   ```
   mwala init

3. **Run the development server:**
   ```sh
   mwala serve
   OR
   mwala app.mjs
   OR
   pm2 start app.mjs
   OR
   node app.mjs
   OR RUN
   npm start
   ```

## Sample Code
A simple MwalaJS route example:
Your MwalaJS file structure is well-organized, but to make it more convincing for developers to switch, consider:

1. Clean File Structure Explanation
Hereâ€™s a structured breakdown:
FOLDERS

  -- mwalajs/              # Root directory  
  │──  app.mjs           # Main application entry point  
  │──  ATTENDANCE/       # Attendance-related files (clarify purpose)  
  │──  bin/              # Executable scripts  
  │──  config/           # Configuration files  
  │──  controllers/      # Business logic controllers  
  │──  middlewares/      # Request middlewares  
  │──  migrations/       # Database migrations  
  │──  models/           # Database models  
  │──  mwalajs/          # Core framework code  
  │──  public/           # Static assets (CSS, JS, Images)  
  │──  routes/           # API & web routes  
  │──  views/            # Frontend templates (if using templating)  
  │──  dist/             # Compiled or bundled output  
  │── package.json      # Dependencies & scripts  
  │── README.md         # Project documentation  
  │── start.bat         # Windows startup script  
  │── setup.sh          # Unix-based setup script  
  │── createProject.mjs # Automates project creation  
  │──  runMigrations.mjs # Database migration script  
  │──  installer/        # Installer-related files  
  │──  node_modules/     # Dependencies  
  2. Why Developers Should Switch to MwalaJS
  MwalaJS should highlight:
   Better modular structure (prevents spaghetti code)
   Built-in migrations & models (reduces DB setup time)
   Simplified setup scripts (automates installation)
   Performance optimizations (mention key tech choices)
   Security-first approach (middleware for authentication, validation)
  
3. Preventing Module Repetition
Are there duplicate functionalities in middlewares/, controllers/, or mwalajs/?
If mwalajs/ is the core framework, maybe avoid repeating similar logic inside controllers/

## Future of Web Development
MwalaJS is designed to replace traditional frameworks by offering a modern, easy-to-use,
and high-performance alternative. Whether you are building a simple website or a complex web application,
MwalaJS provides the tools you need for success.
## Contribute
We welcome contributors! Feel free to fork the repository, submit issues, and make pull requests.

## License
MwalaJS is open-source and licensed under the MIT License.
© 2025 MwalaJS Documentation | All Rights Reserved

About MwalaJS Framework
Your reliable framework for modern applications

Founder: Hekima Ambalile Mwala
About the Founder
Hekima Ambalile Mwala is the founder of the MwalaJS framework. He is a highly motivated and passionate software developer with a vision of creating efficient and scalable web applications. He believes in the power of technology to solve real-world problems.

Also work as Electronics and Telecommunication Engineer

you may prefer To learn Engineering and Technology in his youtube account link >> youtube chanel

Contact Information:

Phone: 0747285438

Email: hekimamwala1@gmail.com

Work Email: biasharaboraofficials@gmail.com

Workplace: Biashara Bora

Our Locations
MwalaJS operates throughout Tanzania, with a special focus on the following key regions:

Dodoma, Tanzania (Main Hub)
Arusha, Tanzania (Main Hub)
Dar Es Salaam, Tanzania (Main Branch)
Mbeya, Tanzania (Main Branch)
Morogoro, Tanzania (Main Branch)
SOUTH AFRICA (Main Branch)
Get in Touch with Us
For more information or any inquiries, feel free to reach out to us via the contact details mentioned above. We are committed to providing the best solutions for your business needs.


1. VERSION RELEASE
Click below to download the installer For Mwalajs framework:



Click below to download zip file mwalajs framework:



Click below to download rar file mwalajs framework :

// help.mjs
export function displayHelp(pkg) {
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

   ${yellow}mwala -v | --version ${reset}               Show MwalaJS version
  ${yellow}mwala help | h${reset}         Show this help menu
  ${yellow}mwala init${reset}             Initialize MwalaJS in the current directory
  ${yellow}mwala serve${reset}            Start the application server (app.mjs) | Run app locally


${line}

${boxTop}
${bright}║             PROJECT SCAFFOLDING (🏗️)                      ║${reset}
${boxBot}

  ${green}mwala create-project${reset}   Create a new project with full structure
  ${green}mwala generate model${reset}      <name>  Generate a Model file
  ${green}mwala generate controller${reset} <name>  Generate a Controller file
  ${green}mwala generate route${reset}      <name>  Generate a Route file
  ${green}mwala generate view${reset}       <name>  Generate a View file (.ejs)
  ${green}mwala generate middleware${reset} <name>  Generate a Middleware file


${line}

${boxTop}
${bright}║                  DATABASE CORE (🗄️)                        ║${reset}
${boxBot}

  ${blue}mwala create-db${reset}        Check or create a DB connection
  ${blue}mwala db:config${reset}        Modify DB settings (host, user, pass)
  ${blue}mwala db:info${reset}          Display general information about your database
  ${blue}mwala db:drop-all-tables${reset} Drop all existing tables (High Risk!)

  ${gray}→ Table Operations:${reset}
    ${blue}mwala db:table list${reset}      List all existing tables
    ${blue}mwala db:table create${reset}    Create a new table
    ${blue}mwala db:table drop${reset}      Delete a specific table
    ${blue}mwala db:table truncate${reset}  Clear all data within a table
    ${blue}mwala db:table rename${reset}    Change table name
    ${blue}mwala db:table copy${reset}      Copy a table to another table
    ${blue}mwala db:table describe${reset}  Show table schema/structure
    ${blue}mwala db:table count${reset}     Show total row count for a table
    ${blue}mwala db:table exists${reset}    Check if a table exists in the DB

${line}

${boxTop}
${bright}║               MIGRATION SYSTEM                         ║${reset}
${boxBot}

 ${magenta}mwala migrate all${reset}      Execute all pending migrations
  ${magenta}mwala rollback last${reset}   Undo the last migration
  ${magenta}mwala rollback all${reset}    Undo all migrations ( destructive )

${line}

${boxTop}
${bright}║                   DATA FLOW (📦)                           ║${reset}
${boxBot}


 ${cyan}Import (Single):${reset}
    Import data from a single file (.csv, .json, .sql) into a table
    ${cyan}mwala db:import${reset} <file> <table>

  ${cyan}Import (Bulk):${reset}
    Bulk import data from an entire exports folder
    ${cyan}mwala db:import-all${reset} <folder_path> [csv|json|sql|all]

  ${cyan}Export:${reset}
    Export table data to a specified format
    ${cyan}mwala db:export${reset} <table> <file.csv|json|sql>

  ${cyan}Export All:${reset}
    Export all DB tables into a dated Folder and ZIP archive
    ${cyan}mwala db:export-all${reset} <csv|json|sql|all>



  ${cyan}Import examples:${reset}
    ${cyan}mwala db:import${reset} users.csv users
    ${cyan}mwala db:import${reset} backup.sql users
     ${cyan}mwala db:import${reset} backup.json users

${line}

  ${cyan}Export examples:${reset}
    Exports table to specified format (CSV, JSON, SQL)
    code structure: mwala db:export <table> <file.(csv|json|sql)>
    ${cyan}mwala db:export${reset} users users.json
    ${cyan}mwala db:export${reset} users users.csv
    ${cyan}mwala db:export${reset} users users.sql

  ${gray}Tip:${reset} CSV/JSON = data only • SQL = structure + data

${line}

${blue}mwala db:export-all csv${reset}
   → Export all tables to CSV format

${blue}mwala db:export-all json${reset}
   → Export all tables to JSON format

${blue}mwala db:export-all sql${reset}
   → Export all tables to SQL dump

${blue}mwala db:export-all all${reset}
   → Export everything (CSV + JSON + SQL)

${gray}Output:${reset}
   exports/YYYY-MM-DD/
   → Each table saved as separate file

${gray}Auto feature:${reset}
   ✔ Creates export folder by date
   ✔ Exports all database tables
   ✔ Auto-generates ZIP archive
   ✔ Ready for backup / migration / sharing

${line}

${boxTop}
${bright}║                BACKUP & SEEDING                        ║${reset}
${boxBot}

   ${red}mwala db:seed${reset} <file.js>   Insert test data (seeding)
  ${red}mwala db:backup${reset} [custom-name]    Generate a full SQL dump of the database
  ${red}mwala db:restore${reset} <file.sql>  Restore database from a SQL file


  Example:
    ${red}mwala db:backup${reset} prod-2026-03-21

${line}

${boxTop}
${bright}║               MAINTENANCE TOOLS (🛠)                       ║${reset}
${boxBot}

  ${yellow}mwala db:size${reset}          Show database size on disk
  ${yellow}mwala db:indexes${reset} <table> Show all indexes for a table
  ${yellow}mwala db:analyze${reset} <table> Inspect and optimize table performance
  ${yellow}mwala db:vacuum${reset}         Clean and reclaim DB storage space
  ${yellow}mwala db:connections${reset}    Show currently active connections
  ${yellow}mwala db:kill-connections${reset} Kill all other active connections ${red}⚠ admin only${reset}

  
${line}

${line}

${boxTop}
${bright}║            DB FORMATTER ENGINE (NEW CORE)               ║${reset}
${boxBot}

  ${green}mwala db:merge-separate${reset} Separate CREATE statements from INSERTs
  ${green}mwala db:sql-to-mongo${reset}   Convert SQL INSERTs to MongoDB JSON
  ${green}mwala db:mongo-to-sql${reset}   Convert MongoDB JSON to SQL INSERTs
  ${green}mwala db:convert${reset}       Convert syntax (mysql | mongo | postgres)
  ${green}mwala db:normalize xampp${reset} Fix common issues in XAMPP SQL dumps

  ${green} Examples ${green}
  ${green}mwala db:merge-separate <file.sql>${reset}
     → Splits CREATE vs INSERT

  ${green}mwala db:sql-to-mongo <file.sql>${reset}
     → SQL → MongoDB JSON

  ${green}mwala db:mongo-to-sql <file.json>${reset}
     → MongoDB → SQL INSERTS

  ${green}mwala db:convert <mysql|mongo|postgres> <file>${reset}
     → Cross-database migration

  ${green}mwala db:normalize xampp <file.sql>${reset}
     → Fix broken XAMPP dumps

${line}

${line}

${boxTop}
${bright}║            AUTO SYSTEM (⚡ PM2 + CRON)                    ║${reset}
${boxBot}


  ${red}mwala autodb-backup init${reset}
     → Setup backup config (email, interval, encryption)

  ${red}mwala autodb-backup start${reset}
     → Run backup in foreground (dev mode)

  ${red}mwala autodb-backup stop${reset}
     → Stop running backup process

  ${red}mwala autodb-backup status${reset}
     → Show backup system status

  ${red}mwala autodb-backup logs${reset}
     → View backup logs

  ${red}mwala autodb-backup decrypt <file.enc>${reset}
     → Decrypt single backup file

  ${red}mwala autodb-backup decrypt:folder <dir>${reset}
     → Decrypt all backups in folder

      ${red}Summary${reset}
  ${magenta}mwala autodb-backup init${reset}    Configure email and backup interval
  ${magenta}mwala autodb-backup start${reset}   Start the automated backup process
  ${magenta}mwala autodb-backup status${reset}  Check backup system status
  ${magenta}mwala autodb-backup logs${reset}    View past backup logs
  ${magenta}mwala autodb-backup decrypt${reset}  Decrypt an encrypted backup file

${line}

${boxTop}
${bright}║              PM2 PRODUCTION COMMANDS                    ║${reset}
${boxBot}

  ${green}pm2 start mwala --name mwala-db-autobackup -- autodb-backup start${reset}
     → Start in production (GLOBAL CLI)

  ${green}pm2 start bin/mwala.mjs --name mwala-db-autobackup -- autodb-backup start${reset}
     → Start in production (LOCAL PROJECT)

  ${green}pm2 save${reset}
     → Save processes for reboot auto-start

  ${green}pm2 startup${reset}
     → Enable system service (boot auto-start)

  ${green}pm2 logs mwala-db-autobackup${reset}
     → Live monitoring logs

  ${green}pm2 restart mwala-db-autobackup${reset}
     → Restart backup service

  ${green}pm2 stop mwala-db-autobackup${reset}
     → Stop service

${line}


${boxTop}
${bright}║                  DEVELOPER NOTES                        ║${reset}
${boxBot}

 ${blue}
Here are 5 clean help-page descriptions with link included:

Configure your Gmail App Password for secure email automation and backups: https://myaccount.google.com/apppasswords
Enable 2-Step Verification to unlock secure app access for your Google account: https://myaccount.google.com/security
Use MwalaJS Auto Backup system to schedule and manage database backups easily via CLI commands.
Learn how to run MwalaJS in production using PM2 for stable background processes and auto-restart support.
Access full MwalaJS documentation and updates for advanced CLI, database tools, and automation features: https://github.com/mwala400/mwalajs

  • Use meaningful backup names (date + description)
  • Avoid rollback all in production
  • Prefer SQL for full migrations
  • Use CSV/JSON for fast data sync

  ||for formating db file engine commands:

  • Always backup before conversion
  • Use normalize for XAMPP dumps
  • Use merge-separate for migration prep
  • SQL = structure + data pipeline

  • Gmail App Passwords: https://myaccount.google.com/apppasswords
  • MwalaJS Documentation: https://github.com/mwala400/mwalajs
  • Use PM2 to run the backup service in Production environments
  • Always perform a backup before using "rollback all" or "drop-all-tables"
${line}

${bright} MWALAJS — Control. Simplicity. Power.${reset}
${gray}“Built for developers who hate complexity”${reset}

${line}

${green}Happy Coding — Build like a pro, no stress!${reset}

  `);

  process.exit(0);
}

