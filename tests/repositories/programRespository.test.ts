import { ProgramRepository } from "../../src/repositories/programRepository";
import { ResidentRepository } from "../../src/repositories/residentRepository";
import { randProgram, randResident } from "../support/fixtures";
import { initDB, resetDB } from "../support/init";
import { expect } from "chai";
import { Resident } from "../../src/models/Resident";
import { Program } from "../../src/models/Program";
import _ from 'lodash'; 
import { RecommendationLikesScoreRepository } from "../../src/repositories/recommendationLikesScoreRepository";

describe('Program Repository', () => {
  before(() => {
    return initDB();
  });

  beforeEach(() => resetDB());
  
  let resident: Resident;
  let residentHobbies: string[];
  let residentHobbiesByProgram: string[];
  let residentPrograms: Program[];
  let otherPrograms: Program[];

  beforeEach(async () => {
    otherPrograms = [randProgram(), randProgram(), randProgram()];
    await ProgramRepository.save(otherPrograms);
  });

  describe('getTotalProgramsByHobbies', () => {
    describe('when hobbies is empty', () => {
      beforeEach(async () => {
        resident = randResident();
        resident.hobbies = [];
        residentHobbies = [];
        await ResidentRepository.save(resident);
      });
      
      it('returns empty programs filtering by userId', async () => {
        const result = await ProgramRepository.getTotalProgramsByHobbies(resident.userId, residentHobbies);
        expect(result).to.be.deep.equals([]);
      });
    });

    describe('when there are hobbies', () => {
      beforeEach(async () => {
        resident = randResident();
        await ResidentRepository.save(resident);

        residentPrograms = [randProgram(), randProgram(), randProgram()].map((program) => {
          program.attendees = [resident];
          return program;
        });

        residentHobbiesByProgram = residentPrograms.flatMap((program) => program.hobbies);
        residentHobbies = resident.hobbies;

        await ProgramRepository.save(residentPrograms);
      });

      it('returns total of programs by hobby filtering by userId', async () => {
        const result = await ProgramRepository.getTotalProgramsByHobbies(resident.userId, [...residentHobbies, ...residentHobbiesByProgram]);
        const totalByProgramHobbyMap = _.groupBy(residentHobbiesByProgram, (hobby) => hobby);
        const totalByProgramHobby = _.map(totalByProgramHobbyMap, (values, hobby) => {
          return { total: values.length, hobby };
        });
        
        expect(result).to.have.deep.members(totalByProgramHobby);
      });
    });
  });

  describe('getRecommendedByLikeScores', () => {
    
    beforeEach(async () => {
      resident = randResident();
      await ResidentRepository.save(resident);
      /*
        hobby scores

        Latin: 3, score: 0,42857143
        Rock: 1, score: 0,14285714
        Pop: 3, score: 0,42857143
        Soul: 2, score: 0,28571429

        program weights
        0 - 0,42857143+0,42857143+0,28571429 -> 1,14285715
        2 - 0,42857143+0,42857143 -> 0,85714286
        1 - 0,14285714+0,28571429+0,42857143 -> 0,85714286
        3 - 0,42857143 -> 0,42857143
      */
      
      residentPrograms = [randProgram(['Latin', 'Pop', 'Soul']), randProgram(['Rock', 'Soul', 'Latin']), randProgram(['Latin', 'Pop']), randProgram(['Pop'])];
      const programsWithAttend = residentPrograms.map((program) => {
        program.attendees = [resident];
        return program;
      });
      await ProgramRepository.save(programsWithAttend);
    });

    describe('when there are programs with score > 0', () => {
      beforeEach(async () => {
        const recLikeScores = [
          { userId: resident.userId, hobby: 'Latin', score: 0.42857143 },
          { userId: resident.userId, hobby: 'Rock', score: 0.14285714 },
          { userId: resident.userId, hobby: 'Pop', score: 0.42857143 },
          { userId: resident.userId, hobby: 'Soul', score: 0.28571429 }
        ]

        await RecommendationLikesScoreRepository.save(recLikeScores);
      });

      it('return the 3 highest program best scores', async () => {
        const result = await ProgramRepository.getRecommendedByLikeScores(resident.userId);
        
        // avoid date differences
        const resultIds = result.map((program) => program.id);
        const expectedIds = [residentPrograms[0].id, residentPrograms[1].id, residentPrograms[2].id];

        expect(resultIds).to.have.deep.members(expectedIds);
      });
    });

    describe('when there are no programs with score > 0', () => {

      it('return the 3 programs', async () => {
        const result = await ProgramRepository.getRecommendedByLikeScores(resident.userId);
        const resultIds = result.map((program) => program.id);
        const allIds = residentPrograms.map((program) => program.id);
        
        expect(allIds).to.have.include.members(resultIds);
      });
    });
  });
});
