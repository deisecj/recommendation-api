import * as dotenv from 'dotenv';
import { TableInheritance } from 'typeorm';
dotenv.config({ path: '.env.test' });

import { initializeApiServer } from "../../src/apiServer";
import { AppDataSource } from '../../src/repositories/data-source';

export const initDB = async () => {
  if (AppDataSource.isInitialized) {
    return;
  }

  return AppDataSource.initialize();
}

export const resetDB = async () => {
  const all = ['recommendation_likes_score', 'program_attendees_resident', 'program', 'resident'];
  
  for (const tableName of all) {
    await AppDataSource.query(`DELETE FROM ${tableName}`);
  }
}


export const apiServer = initializeApiServer();