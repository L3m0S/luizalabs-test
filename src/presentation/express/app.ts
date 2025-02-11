import 'reflect-metadata';
import express, { Router } from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { setupRoutes } from './config/setupRoutes';
import { errorHandler } from './middlewares/ErrorHandler';
import { requestBodyTypeHandler } from './middlewares/RequestTypeBodyHandler';

const app = express();

app.use(
	express.json({
		limit: '100kb',
		type: 'application/json',
	}),
);

app.use(helmet());
app.use(cors());

app.use(morgan(`tiny`));
app.use(express.json());
app.use(compression());

app.use(requestBodyTypeHandler);
setupRoutes(app);
app.use(errorHandler);

export { app };
