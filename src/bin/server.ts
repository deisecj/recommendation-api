import * as dotenv from 'dotenv';
dotenv.config();
import 'reflect-metadata';
import { initializeApiServer } from '../apiServer';
import { AppDataSource } from '../repositories/dataSource';

const apiServerPort = process.env.APP_PORT;

AppDataSource.initialize().then(() => {
  initializeApiServer().listen(apiServerPort, () => {
    return console.log(`API Server is listening at http://localhost:${port}`);
  });
});
