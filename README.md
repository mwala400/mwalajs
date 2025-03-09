# MwalaJS Framework

MwalaJS is a lightweight JavaScript framework designed to create modern web applications with minimal effort.

## Installation

To install MwalaJS, run the following command:

```bash
npm install mwalajs

---

### **Tafuta/Run Mwala App**:

1. **Create Project**:
   Watumiaji watatumia `mwala create <project-name>` kwa kuanzisha mradi mpya.

2. **Run Project**:
   Kisha, watatumia `mwala app.js` au `mwala index.js` kuendesha app yao.

---

**Hii ni structure ya msingi ya framework yako.** Watumiaji watatumia `mwala` kama command-line tool, na kwa hiyo, watatumia jina lako la package (`mwalajs`) ili ku-install kutoka npm.
# mwalajs

Here are all the commands you've set up for your migration system, based on the setup you've described:

List of Commands:
Create a new table:


mwala create-table <table_name>
Example: mwala create-table users
Drop a table:

mwala drop-table <table_name>
Example: mwala drop-table users
Run all migrations:


mwala migrate all
This will run all pending migrations.
Run a specific migration:


mwala migrate <migration_name>
Example: mwala migrate 20250308074542-create-user.js
This will run the specific migration file.
Rollback all migrations:


mwala rollback all
This will undo all migrations, rolling back your database to its initial state.
Rollback a specific migration:

mwala rollback <migration_name>
Example: mwala rollback 20250308074542-create-user.js
This will undo a specific migration file.
Additional Commands (Can be added if necessary):
Check status of migrations (if implemented):


mwala status
Seed database with initial data (if implemented):


mwala seed <seeder_name>
Example: mwala seed userSeeder
These are the commands you can use with your migration system, as you've set up with the mwala CLI. Make sure the paths and names match those in your project.






Here is the list of all the commands available in your mwala.js script:

1. Create a new MVC project

mwala create <appname>
Creates a new MVC project structure.
2. Run app.js

mwala app.js
Runs app.js to start the project.
3. Database Commands

mwala db <command>
create-database: Creates a new database (based on configuration).
migrate: Runs migrations.
rollback: Rolls back migrations.
4. Generate MVC Components

mwala generate <model/controller/route/view> <name>
Generates a new model, controller, route, or view in the project.
5. Add Middleware

mwala add middleware <middlewareName>
Adds a new middleware file to the project.
6. Serve the Project

mwala serve
Starts the project server (equivalent to running mwala app.js).
7. Show Available Commands

mwala help
Displays the list of available commands.
8. Create a Table in the Database

mwala create-table <table_name>
Creates a new table in the database.
9. Drop a Table from the Database

mwala drop-table <table_name>
Drops an existing table from the database.
10. Run Migrations

mwala migrate
Runs migrations to apply schema changes.
11. Rollback Migrations

mwala rollback
Rolls back the last migration.
Example for Command Usage:
Create a new MVC project:

mwala create myProject
Generate a model:


mwala generate model user
Create a new table:


mwala create-table users
Run all migrations:

mwala migrate all
Add a middleware:


mwala add middleware authMiddleware# mwalajsm
# mwalajsm
# mwalajsm
