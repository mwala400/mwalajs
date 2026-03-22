// createDatabase.mjs
// This file is responsible for creating the database based on the configuration provided by the user. It will be used during the setup process to create the database before any tables or collections are created. This file can be imported in setupMwalajs.mjs to run the database creation logic as part of the setup process.
import fs from 'fs';
import readlineSync from 'readline-sync';
import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import sqlite3 from 'sqlite3';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;

/* -----------------------------------------------------------
   NEW FUNCTION: CREATE BACKUP OF .ENV BEFORE DELETE
----------------------------------------------------------- */
const backupEnvFile = () => {
  try {
    if (!fs.existsSync('.env')) {
      console.log('  No .env file found to backup.');
      return;
    }

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-'); // safe filename

    const backupName = `.env.backup-${timestamp}`;

    fs.copyFileSync('.env', backupName);

    console.log(`  Backup created: ${backupName}`);
  } catch (error) {
    console.error('  Failed to create .env backup:', error.message);
  }
};

/* -----------------------------------------------------------
   RESET ENV FILE
----------------------------------------------------------- */
const resetEnvFile = () => {
  try {
    fs.writeFileSync('.env', '', 'utf8');
    console.log('  Cleared .env file.');
  } catch (error) {
    console.error('  Failed to clear .env file:', error.message);
  }
};

/* -----------------------------------------------------------
   WRITE DATA TO .ENV
----------------------------------------------------------- */
const writeToEnv = (data) => {
  const envContent = Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join('\n');

  fs.writeFileSync('.env', envContent, 'utf8');
};

/* -----------------------------------------------------------
   MAIN FUNCTION: CREATE/CONNECT DATABASE
----------------------------------------------------------- */
export const getDbConnection = async () => {

  //  FIRST CREATE BACKUP
  backupEnvFile();

  //  THEN CLEAR OLD ENV
  resetEnvFile();

  // Reload environment
  dotenv.config();

  const supportedDbTypes = {
    mysql: 'mysql',
    my: 'mysql',
    postgresql: 'postgresql',
    pg: 'postgresql',
    mongodb: 'mongodb',
    mn: 'mongodb',
    sqlite: 'sqlite',
    sq: 'sqlite'
  };

  let dbType;
  while (true) {
    dbType = readlineSync.question(
      'Enter DB type (mysql/my, postgresql/pg, mongodb/mn, sqlite/sq): '
    ).toLowerCase();

    if (supportedDbTypes[dbType]) {
      dbType = supportedDbTypes[dbType];
      break;
    } else {
      console.log('  Invalid database type. Try again.');
    }
  }

  const dbName = readlineSync.question('Enter the database name: ').trim();
  if (!dbName) {
    console.log('  Database name cannot be empty.');
    return;
  }

  let dbHost = 'localhost';
  let dbUser = '';
  let dbPassword = '';

  if (dbType !== 'sqlite') {
    dbHost = readlineSync.question('Enter DB host (default: localhost): ') || 'localhost';
    dbUser = readlineSync.question('Enter DB user: ').trim();
    dbPassword = readlineSync.question('Enter DB password: ', { hideEchoBack: true }).trim();
  }

  const envData = {
    DB_TYPE: dbType,
    DB_NAME: dbName,
    DB_HOST: dbHost,
    DB_USER: dbUser,
    DB_PASSWORD: dbPassword
  };

  writeToEnv(envData);
  console.log('  Database credentials saved to .env');

  let connection;

  try {
    /* -------------------- MYSQL -------------------- */
    if (dbType === 'mysql') {
      const tempConnection = await mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword
      });

      const [rows] = await tempConnection.query(`SHOW DATABASES LIKE '${dbName}'`);
      if (rows.length === 0) {
        await tempConnection.query(`CREATE DATABASE \`${dbName}\``);
        console.log(`  MySQL database "${dbName}" created.`);
      } else {
        console.log(`  MySQL database "${dbName}" already exists.`);
      }

      connection = await mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName
      });

      await tempConnection.end();
    }

    /* -------------------- POSTGRESQL -------------------- */
    else if (dbType === 'postgresql') {
      const tempClient = new Client({
        host: dbHost,
        user: dbUser,
        password: dbPassword
      });

      await tempClient.connect();

      const checkDb = await tempClient.query(
        `SELECT datname FROM pg_database WHERE datname = '${dbName}'`
      );

      if (checkDb.rows.length === 0) {
        await tempClient.query(`CREATE DATABASE ${dbName}`);
        console.log(`  PostgreSQL database "${dbName}" created.`);
      } else {
        console.log(`  PostgreSQL database "${dbName}" already exists.`);
      }

      await tempClient.end();

      connection = new Client({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName
      });

      await connection.connect();
    }

    /* -------------------- MONGODB -------------------- */
    else if (dbType === 'mongodb') {
      connection = await MongoClient.connect(`mongodb://${dbHost}:27017`);
      console.log(`  MongoDB connected.`);
    }

    /* -------------------- SQLITE -------------------- */
    else if (dbType === 'sqlite') {
      connection = new sqlite3.Database(`./${dbName}.sqlite`);
      console.log(`  SQLite database "${dbName}.sqlite" ready.`);
    }

  } catch (error) {
    console.error(`  Failed to create database: ${error.message}`);
    return;
  }

  return connection;
};
