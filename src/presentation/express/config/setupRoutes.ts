import { Express, Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';

export const setupRoutes = (app: Express): void => {
	const router = Router();
	app.use('/api/v1/', router);

	const ROUTES_DIR = path.resolve(__dirname, '..', '..', 'http', 'routes');

	readdirSync(ROUTES_DIR).map(async (fileName) => {
		if (['.routes.ts', '.routes.js'].some((endRouter) => fileName.endsWith(endRouter))) {
			(await import(`../../http/routes/${fileName}`)).default(router);
		}
	});
};
