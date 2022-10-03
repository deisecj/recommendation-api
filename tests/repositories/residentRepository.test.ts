import { ResidentRepository } from "../../src/repositories/residentRepository";
import { initDB, resetDB } from "../support/init";
import { expect } from 'chai';
import { randProgram, randResident } from "../support/fixtures";
import { ProgramRepository } from "../../src/repositories/programRepository";

describe('Resident Repository', () => {
  before(() => {
    return initDB();
  });

  beforeEach(() => resetDB());

  let resident;

  describe('getHobbies', () => {
    describe('when resident does not have hobbies and does not attend program', () => {
      
      beforeEach(async () => {
        resident = randResident();
        resident.hobbies = [];
        await ResidentRepository.save(resident);
      });

      it('returns empty list', async () => {
        const result = await ResidentRepository.getHobbies(resident.userId);
        expect(result).to.deep.equals([]);
      });
    });

    describe('when resident has hobbies and attended programs', () => {
      let residentPrograms;
      let otherProgram;
      
      beforeEach(async () => {
        resident = randResident();
        residentPrograms = [randProgram(), randProgram()].map((program) => {
          program.attendees = [resident];
          return program;
        });
        otherProgram = randProgram();

        await ResidentRepository.save(resident);
        await ProgramRepository.save([...residentPrograms, otherProgram]);
      });

      it('returns list of hobbies', async () => {
        const residentProgramsHobbies = residentPrograms.flatMap((program) => program.hobbies);
        const allHobies = [...resident.hobbies, ...residentProgramsHobbies];
        const expectedResult = Array.from(new Set(allHobies)) // remove duplicate

        const result = await ResidentRepository.getHobbies(resident.userId);

        expect(result).to.have.members(expectedResult);
      });
    });

    describe('when resident does not have hobbies but attended programs', () => {
      let residentPrograms;
      let otherProgram;

      beforeEach(async () => {
        resident = randResident();
        resident.hobbies = [];
        await ResidentRepository.save(resident);
        residentPrograms = [randProgram(), randProgram()].map((program) => {
          program.attendees = [resident];
          return program;
        });
        otherProgram = randProgram();
        
        await ResidentRepository.save(resident);
        await ProgramRepository.save([...residentPrograms, otherProgram]);
      });

      it('returns list of hobbies', async () => {
        const residentProgramsHobbies = residentPrograms.flatMap((program) => program.hobbies);
        const expectedResult = Array.from(new Set(residentProgramsHobbies)) // remove duplicate

        const result = await ResidentRepository.getHobbies(resident.userId);

        expect(result).to.have.members(expectedResult);
      });
    });
  });
});
