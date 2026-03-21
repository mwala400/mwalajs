import fs from 'fs';
import readlineSync from 'readline-sync';
import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import sqlite3 from 'sqlite3';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;

// Function to reset the .env file before processing
const resetEnvFile = () => {
  try {
    fs.writeFileSync('.env', '', 'utf8'); // Empty the .env file
    console.log(' Cleared .env file.');
  } catch (error) {
    console.error(' Failed to clear .env file:', error.message);
  }
};

// Function to write data to the .env file
const writeToEnv = (data) => {
  const envContent = Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join('\n');

  fs.writeFileSync('.env', envContent, 'utf8');
};


// Function to create the database connection
export const getDbConnection = async () => {
  resetEnvFile(); // Clear .env file before proceeding

  dotenv.config(); // Reload the (now empty) .env file

  // Supported database types
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
    dbType = readlineSync.question('Enter the database type (mysql/my, postgresql/pg, mongodb/mn, sqlite/sq): ').toLowerCase();
    if (supportedDbTypes[dbType]) {
      dbType = supportedDbTypes[dbType]; // Normalize input
      break;
    } else {
      console.log('❌ Invalid database type. Please enter a valid option.');
    }
  }

  // Prompt for database details
  const dbName = readlineSync.question('Enter the database name: ').trim();
  if (!dbName) {
    console.log(' Database name cannot be empty.');
    return;
  }

  let dbHost = 'localhost';
  let dbUser = '';
  let dbPassword = '';

  if (dbType !== 'sqlite') {
    dbHost = readlineSync.question('Enter the database host (default: localhost): ') || 'localhost';
    dbUser = readlineSync.question('Enter the database user: ').trim();
    dbPassword = readlineSync.question('Enter the database password: ', { hideEchoBack: true }).trim();
  }

  // Save valid details to .env
  const envData = {
    DB_TYPE: dbType,
    DB_NAME: dbName,
    DB_HOST: dbHost,
    DB_USER: dbUser,
    DB_PASSWORD: dbPassword,
  };

  writeToEnv(envData);
  console.log(' Database credentials saved to .env file.');

  let connection;

  try {
    if (dbType === 'mysql') {
      const tempConnection = await mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
      });

      const [rows] = await tempConnection.query(`SHOW DATABASES LIKE '${dbName}'`);
      if (rows.length === 0) {
        await tempConnection.query(`CREATE DATABASE \`${dbName}\``);
        console.log(` MySQL Database "${dbName}" created successfully.`);
      } else {
        console.log(` MySQL Database "${dbName}" already exists.`);
      }

      connection = await mysql.createConnection({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName,
      });

      await tempConnection.end();
    } else if (dbType === 'postgresql') {
      const tempClient = new Client({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
      });

      await tempClient.connect();

      const checkDb = await tempClient.query(`SELECT datname FROM pg_database WHERE datname = '${dbName}'`);
      if (checkDb.rows.length === 0) {
        await tempClient.query(`CREATE DATABASE ${dbName}`);
        console.log(` PostgreSQL Database "${dbName}" created successfully.`);
      } else {
        console.log(` PostgreSQL Database "${dbName}" already exists.`);
      }

      await tempClient.end();

      connection = new Client({
        host: dbHost,
        user: dbUser,
        password: dbPassword,
        database: dbName,
      });

      await connection.connect();
    } else if (dbType === 'mongodb') {
      connection = await MongoClient.connect(`mongodb://${dbHost}:27017`);
      console.log(` MongoDB connection to "${dbName}" established.`);
    } else if (dbType === 'sqlite') {
      connection = new sqlite3.Database(`./${dbName}.sqlite`);
      console.log(` SQLite Database "${dbName}.sqlite" is ready.`);
    } else {
      throw new Error(` Unsupported DB type: ${dbType}`);
    }
  } catch (error) {
    console.error(` Failed to create database: ${error.message}`);
    return;
  }

  return connection;
};
