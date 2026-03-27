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

