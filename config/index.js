import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT,
  secret: 'yottabyte',
  db: {
    name: `${process.env.DB_NAME}`,
    username: `${process.env.DB_USER_NAME}`,
    password: `${process.env.DB_PASSWORD}`,
    host: `${process.env.DB_HOST}`,
    dialect: `${process.env.DB_DIALECT}`
  }
};
