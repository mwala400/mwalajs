README.md
📦 MWALA DB FILE FORMATTER ENGINE
 Overview

Mwala DB Formatter Engine ni system ya advanced database file processor inayoweza:

Kugawanya SQL files (CREATE / INSERT / ALTER)
Kutambua database type automatically
Kubadilisha SQL kwenda MongoDB format
Kubadilisha MongoDB kwenda SQL
Kusafisha XAMPP/MySQL dumps
Export data kwenda SQL / JSON / CSV
Support multi-database conversion (MySQL, PostgreSQL, MongoDB)
⚙️ Features
 Core Features
SQL parsing engine (CREATE / INSERT separation)
DB auto-detection engine
XAMPP/MySQL normalization
Multi-format export (SQL, JSON, CSV)
Cross-database conversion
🌍 Supported Databases
MySQL / XAMPP
PostgreSQL
MongoDB (logical conversion layer)
Generic SQL dumps
 Installation

If using inside MwalaJS CLI:

npm install

No external dependencies required (pure Node.js).

 CLI COMMANDS GUIDE
📦 1. MERGE & SEPARATE SQL FILE
mwala db:merge-separate <file.sql>
 What it does:
Detects database type automatically
Splits SQL into:
CREATE statements
INSERT statements
Generates multiple output files
 Output files:
file-crud.sql       → Schema / structure only
file-insert.sql     → Data only
file-crud.json      → Schema metadata
file-insert.json    → Insert data in JSON format
file-insert.csv     → Flattened data export
 2. SQL → MONGODB CONVERSION
mwala db:sql-to-mongo <file.sql>
 What it does:
Extracts INSERT statements
Converts them into MongoDB-style documents
 Output:
file-mongo.json
 Use case:
Migrating SQL → MongoDB
API migration projects
NoSQL transformation
 3. MONGODB → SQL CONVERSION
mwala db:mongo-to-sql <file.json>
 What it does:
Reads MongoDB JSON documents
Converts them into SQL INSERT statements
📤 Output:
file-sql.sql
🌍 4. DATABASE CONVERSION ENGINE
mwala db:convert <type> <file.sql>
Supported types:
mysql
postgres
mongo
Examples:
mwala db:convert mysql data.sql
mwala db:convert postgres data.sql
mwala db:convert mongo data.sql
 What it does:
Converts SQL syntax to target DB format
Adjusts:
AUTO_INCREMENT → SERIAL (Postgres)
MySQL → normalized SQL
SQL → Mongo JSON structure
 5. XAMPP / MYSQL CLEANER
mwala db:normalize xampp <file.sql>
 What it does:

Removes MySQL/XAMPP-specific syntax:

ENGINE=InnoDB
DEFAULT CHARSET=utf8
AUTO_INCREMENT
Backticks (`)
📤 Output:
file-normalized.sql
🧠 HOW ENGINE WORKS (UNDER THE HOOD)
Step 1: Detection

Engine detects DB type:

MySQL
PostgreSQL
MongoDB
Unknown
Step 2: Parsing

SQL is split into statements:

CREATE TABLE
INSERT INTO
ALTER TABLE
DROP TABLE
Step 3: Classification

Each statement is categorized:

Type	Meaning
CREATE	Schema
INSERT	Data
ALTER	Structure mod
DROP	Delete schema
Step 4: Transformation

Engine converts data into:

SQL files
JSON format
CSV format
MongoDB format
📂 OUTPUT STRUCTURE EXAMPLE

After running:

mwala db:merge-separate users.sql

You get:

users-crud.sql
users-insert.sql
users-crud.json
users-insert.json
users-insert.csv
⚠️ IMPORTANT NOTES
❌ Not recommended:
Running on corrupted SQL files
Mixing different DB dumps without cleaning
 Best practice:
Always backup DB before conversion
Use db:normalize for XAMPP dumps first
Validate SQL before migration
🧩 USE CASES
 Developers
DB migration between systems
API backend restructuring
 Data Engineers
ETL pipelines
Data transformation
 Students
Learning SQL structure
Understanding database systems
 FUTURE FEATURES (ROADMAP)
AI SQL repair engine
ERD diagram generator
Live DB sync (MySQL ↔ Mongo)
Query optimizer
Schema relationship auto-detection
 SUMMARY

 This tool is a:

Multi-database transformation + migration engine built in Node.js

It replaces:

manual SQL cleaning
manual migrations
format conversion tools
basic ETL scripts
💡 ONE-LINE POWER SUMMARY
Mwala DB Formatter Engine = SQL Cleaner + DB Converter + ETL Engine + Migration Toolkit