import "reflect-metadata";
import { DataSource } from "typeorm";
import { Program } from "../models/Program";
import { RecommendationLikesScore } from "../models/RecommendationLikesScore";
import { Resident } from "../models/Resident";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOSTNAME,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Resident, Program, RecommendationLikesScore],
    migrations: [],
    subscribers: [],
});
