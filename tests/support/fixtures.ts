import { faker } from '@faker-js/faker';
import { Program } from '../../src/models/Program';
import { Resident } from "../../src/models/Resident";

export const randResident = () => {
  return Resident.build({
    userId: faker.datatype.uuid(),
    name: faker.name.fullName(),
    birthday: faker.date.past(),
    moveInDate: faker.date.past(),
    roomNumber: faker.datatype.number(),
    hobbies: [faker.music.genre(), faker.music.genre()],
    levelOfCare: faker.word.noun()
  });
}

export const randProgram = (hobbies?: string[]) => {
  return Program.build({
    id: faker.datatype.uuid(),
    name: faker.name.jobTitle(),
    start: faker.date.recent(),
    end: faker.date.future(),
    mode: faker.word.noun(),
    levelsOfCare: [faker.word.noun()],
    hobbies: hobbies || [faker.music.genre(), faker.music.genre(), faker.music.genre()]
  });
}
