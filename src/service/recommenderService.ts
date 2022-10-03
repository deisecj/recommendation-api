import { Resident } from "../models/Resident";
import { ProgramRepository } from "../repositories/programRepository";
import { RecommendationLikesScoreRepository } from "../repositories/recommendationLikesScoreRepository";
import { ResidentRepository } from "../repositories/residentRepository";

export class RecommenderService {

  async computeLikeScores (resident: Resident): Promise<void> {
    const residentHobbies = await ResidentRepository.getHobbies(resident.userId);
    if (residentHobbies.length === 0) {
      return;
    }

    const totalPrograms = await ProgramRepository.getTotalProgramsByHobbies(resident.userId, residentHobbies);
    const map = new Map<string, number>();
    let sum = 0;

    totalPrograms.forEach((element) => {
      map.set(element.hobby, element.total);
      sum = sum + element.total;
    });

    const likesScores = residentHobbies.map((hobby) => {
      const total = map.get(hobby) || 0;
      return { 
        hobby: hobby,
        userId: resident.userId,
        score: total / sum,
      }
    });

   await RecommendationLikesScoreRepository.save(likesScores);
  }
}
