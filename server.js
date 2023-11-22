import mongoose from 'mongoose';
import chalk from 'chalk';
import  * as dotenv from 'dotenv';

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
import app from './app.js';

const DB = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.set('strictQuery', false);

mongoose
  .connect(DB)
  .then(() => console.log(chalk.green('DB connection successful!')))
  .catch(err => console.log(chalk.redBright(err)));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${chalk.greenBright(port)}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
