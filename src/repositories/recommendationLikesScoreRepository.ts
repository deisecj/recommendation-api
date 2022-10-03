import { RecommendationLikesScore } from "../models/RecommendationLikesScore";
import { AppDataSource } from "./dataSource";

export const RecommendationLikesScoreRepository = AppDataSource.getRepository(RecommendationLikesScore);
