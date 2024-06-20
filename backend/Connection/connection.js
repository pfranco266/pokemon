import dotenv from 'dotenv';
dotenv.config(); 

import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';

console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Ensure this is printed as a string
  

  const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: 5432,
    ssl: false,
    clientMinMessages: 'notice',
    logging: console.log,
    query_timeout: 2000,
  });


  
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


  export default sequelize;
