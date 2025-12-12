import { DataSource } from "typeorm";
import { Question } from "./entities/Question";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Question],
    subscribers: [],
    migrations: [],
});
