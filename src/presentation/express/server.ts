import express, { Router } from 'express';
import 'express-async-errors';
import "reflect-metadata"
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { AppDataSource } from "../../infra/database/Datasource";
import { setupRoutes } from "./config/setupRoutes";
import { errorHandler } from "./middlewares/ErrorHandler";

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(cors());

app.use(morgan(`tiny`));
app.use(express.json());
app.use(compression());

setupRoutes(app);
app.use(errorHandler);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  AppDataSource.initialize()
    .then(() => console.log('Database connection stablished...'))
    .catch((error) => console.error('Error on connect to database: ', error.message));
  console.log(`Server running on PORT ${PORT}...`);
});
