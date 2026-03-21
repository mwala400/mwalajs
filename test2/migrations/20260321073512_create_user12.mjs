import { sequelize } from 'mwalajs/config/createTablesetdb';

import { DataTypes } from 'sequelize';

export const up = async () => {
  await sequelize.getQueryInterface().createTable('user12', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date() }
  });
};

export const down = async () => {
  await sequelize.getQueryInterface().dropTable('user12');
};