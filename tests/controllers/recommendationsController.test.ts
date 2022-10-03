import { apiServer } from "../support/init";
import request from 'supertest';
import { initDB, resetDB } from "../support/init";
import { Resident } from "../../src/models/Resident";
import { randProgram, randResident } from "../support/fixtures";
import { ResidentRepository } from "../../src/repositories/residentRepository";
import { Program } from "../../src/models/Program";
import { ProgramRepository } from "../../src/repositories/programRepository";
import { expect } from 'chai';
import { RecommendationLikesScoreRepository } from "../../src/repositories/recommendationLikesScoreRepository";
import { faker } from '@faker-js/faker';

describe('Recommendation API', () => {

  before(() => initDB());
  beforeEach(() => resetDB());

  describe('likes', () => {

    let resident: Resident;
    let residentPrograms: Program[];

    beforeEach(async () => {
      resident = randResident();
      await ResidentRepository.save(resident);
    })

    describe('when there is resident', () => {
      
      beforeEach(async () => {
        residentPrograms = [randProgram(['Latin', 'Pop', 'Soul']), randProgram(['Rock', 'Soul', 'Latin']), randProgram(['Latin', 'Pop']), randProgram(['Pop'])];
        const programsWithAttend = residentPrograms.map((program) => {
          program.attendees = [resident];
          return program;
        });
        await ProgramRepository.save(programsWithAttend);
  
        const recLikeScores = [
          { userId: resident.userId, hobby: 'Latin', score: 0.42857143 },
          { userId: resident.userId, hobby: 'Rock', score: 0.14285714 },
          { userId: resident.userId, hobby: 'Pop', score: 0.42857143 },
          { userId: resident.userId, hobby: 'Soul', score: 0.28571429 }
        ]
  
        await RecommendationLikesScoreRepository.save(recLikeScores);
      })

      it('returns 3 programs based on the recommendation of likes', () => {
        return request(apiServer)
          .get(`/recommendations/${resident.userId}/likes`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => { 
            const expectedIds = [residentPrograms[0].id, residentPrograms[1].id, residentPrograms[2].id];

            const resultIds = response.body.map((program) => program.id);
            expect(resultIds).to.be.deep.eq(expectedIds);
          });
      });
    });

    describe('when there is no resident', () => {
      it('returns empty list', () => {
        return request(apiServer)
        .get(`/recommendations/${faker.datatype.uuid()}/likes`)
          .expect('Content-Type', /json/)
          .expect(200)
          .then((response) => { 
            expect(response.body).to.be.deep.eq([]);
          });
      });
    });
  });
});
