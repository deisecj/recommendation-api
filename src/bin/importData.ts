import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from '../repositories/dataSource';
import { ResidentRepository } from '../repositories/residentRepository';
import { ProgramRepository } from '../repositories/programRepository';

const importData = async (): Promise<void> => {
  const response = await fetch('https://welbi.org/data/backend.json');
  const data: any = await response.json();
  const residents = data.residents;
  const programs = data.programs;

  const allResidents = residents.map((resident) => {
     return {
        ...resident,
        hobbies: resident.hobbies?.split(',')
     }
  });

  await ResidentRepository.save(allResidents);

  const allPrograms = programs.map((program) => {
     return {
      ...program,
      dimensions: program.dimensions.split(','),
      facilitators: program.facilitators.split(','),
      hobbies: program.hobbies?.split(','),
      levelsOfCare: program.levelsOfCare.split(',')
    }
  });
  
  await ProgramRepository.save(allPrograms);

}

AppDataSource.initialize()
 //.then(importData)
 .then(() => console.log('imported successfully'));
