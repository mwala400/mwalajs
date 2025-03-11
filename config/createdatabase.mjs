import fs from 'fs';
import readlineSync from 'readline-sync'; // For getting user input
import mysql from 'mysql2/promise';
import { MongoClient } from 'mongodb';
import sqlite3 from 'sqlite3';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;

export const getDbConnection = async () => {
  dotenv.config(); // Load existing .env file

  // Helper function to write to .env file
  const writeToEnv = (data) => {
    const envContent = Object.keys(data)
      .map(key => `${key}=${data[key]}`)
      .join('\n');
    
    fs.writeFileSync('.env', envContent, 'utf8');
  };

  // Prompt for DB Type (MySQL, PostgreSQL, MongoDB, SQLite)
  const dbType = readlineSync.question('Enter the database type (mysql or my, postgresql or pg, mongodb or mn, sqlite or sq): ').toLowerCase();

  // Prompt for common DB details
  const dbName = readlineSync.question('Enter the database name: ');
  const dbHost = readlineSync.question('Enter the database host (default: localhost): ') || 'localhost';
  const dbUser = readlineSync.question('Enter the database user: ');
  const dbPassword = readlineSync.question('Enter the database password: ', { hideEchoBack: true });

  // Save to .env file
  const envData = {
    DB_TYPE: dbType,
    DB_NAME: dbName,
    DB_HOST: dbHost,
    DB_USER: dbUser,
    DB_PASSWORD: dbPassword,
  };

  writeToEnv(envData);
  console.log('✅ Database credentials saved to .env file.');

  let connection;

  if (dbType === 'mysql' || dbType === 'my') {
    const tempConnection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
    });

    // Check if the database already exists
    const [rows] = await tempConnection.query(`SHOW DATABASES LIKE '${dbName}'`);

    if (rows.length === 0) {
      // Create database if it does not exist
      await tempConnection.query(`CREATE DATABASE \`${dbName}\``);
      console.log(`✅ MySQL Database "${dbName}" created successfully.`);
    } else {
      console.log(`✅ MySQL Database "${dbName}" already exists.`);
    }

    // Now connect to the actual database
    connection = await mysql.createConnection({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    await tempConnection.end();

  } else if (dbType === 'postgresql' || dbType === 'pg') {
    const tempClient = new Client({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
    });

    await tempClient.connect();

    // Check if the database already exists
    const checkDb = await tempClient.query(`SELECT datname FROM pg_database WHERE datname = '${dbName}'`);
    if (checkDb.rows.length === 0) {
      // Create database if it does not exist
      await tempClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ PostgreSQL Database "${dbName}" created successfully.`);
    } else {
      console.log(`✅ PostgreSQL Database "${dbName}" already exists.`);
    }

    await tempClient.end();

    // Now connect to the actual database
    connection = new Client({
      host: dbHost,
      user: dbUser,
      password: dbPassword,
      database: dbName,
    });

    await connection.connect();

  } else if (dbType === 'mongodb' || dbType === 'mn') {
    connection = await MongoClient.connect(`mongodb://${dbHost}:27017`);
    console.log(`✅ MongoDB connection to "${dbName}" established.`);

  } else if (dbType === 'sqlite' || dbType === 'sq') {
    connection = new sqlite3.Database(`./${dbName}.sqlite`);
    console.log(`✅ SQLite Database "${dbName}.sqlite" is ready.`);

  } else {
    throw new Error(`❌ Unsupported DB type: ${dbType} <br> write it manual in .env file if is not supported here`);
  }

  return connection;
};

// 
