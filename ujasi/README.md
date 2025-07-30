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

```javascript
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
```

### homeRoutes.mjs
Here is an example of the default `homeRoutes.mjs` file:

```javascript
import mwalajs from 'mwalajs';
import { homeController, Steps, welcome, about } from '../controllers/homeController.mjs';

const router = mwalajs.constructor.Router();

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
- `mwala create-project <name>`       → Create a new MwalaJS project.
- `mwala init`                         → Initialize MwalaJS in the current project.

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



2. Setting Up MwalaJS
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
            
mwalajsm/ # Root directory
      mwalajsm/               # Root directory
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

  -- mwalajsm/              # Root directory  
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


git clone https://github.com/mwala400/mwalajs.git

