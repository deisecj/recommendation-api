import { Request, Response } from "express";
import { ProgramRepository } from "../repositories/programRepository";

export class RecommendationsController {

  async likes(req: Request, res: Response) {
    const { userId } = req.params;

    const programRecommended = await ProgramRepository.getRecommendedByLikeScores(userId);
    res.json(programRecommended);
  }
}
