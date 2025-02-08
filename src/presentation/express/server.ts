import "reflect-metadata"
import 'express-async-errors';
import express, { Router } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import * as teste from '../../main/customers/cutomers.routes';
import { AppDataSource } from "../../infra/database/Datasource";

const app = express();

app.use(helmet());
app.disable('x-powered-by');
app.use(cors());

app.use(morgan(`tiny`));
app.use(express.json());
app.use(compression());

const router = Router();
teste.default(router);
app.use('/api/v1', router);


app.listen(3333, async () => {
  await AppDataSource.initialize()
    .then(() => console.log('Database connection stablished...'))
    .catch((error) => console.error('Error on connect to database: ', error.message));
  console.log('Server running on PORT 3333...');
});
