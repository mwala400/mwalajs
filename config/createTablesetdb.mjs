import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbType = process.env.DB_TYPE || 'mysql';

let sequelize;
let mongooseConnection;

/**
 * ✅ Fungua connection kulingana na aina ya database
 */
if (['mysql', 'postgres', 'sqlite'].includes(dbType)) {
  sequelize = new Sequelize({
    dialect: dbType,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || (dbType === 'mysql' ? 3306 : 5432),
    storage: dbType === 'sqlite' ? process.env.DB_STORAGE || 'database.sqlite' : undefined,
    logging: false
  });

} else if (dbType === 'mongodb') {
  const mongoUri = `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME}`;
  mongooseConnection = mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

} else {
  throw new Error('Unsupported database type. Check your .env configuration.');
}

export { sequelize, mongooseConnection };
