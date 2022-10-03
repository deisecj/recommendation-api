import express, { Express } from "express";
import { RecommendationsController } from "./controllers/recommendationsController";
import { errorHandler } from './controllers/errorHandler';

const recommendationsController = new RecommendationsController();

export const initializeApiServer = (): Express => {

  const app = express();
 
  app.get('/recommendations/:userId/likes', (req, res, next) => recommendationsController.likes(req, res).catch(next));
  app.use((err, req, res, next) => errorHandler(err, res));

  return app;
}
