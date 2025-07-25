import { sequelize } from '../config/createTablesetdb.mjs';
import { DataTypes } from 'sequelize';

export const up = async () => {
  await sequelize.getQueryInterface().createTable('transactions', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    transactionName: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true }, 
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() }
  });
};

export const down = async () => {
  await sequelize.getQueryInterface().dropTable('transactions');
};