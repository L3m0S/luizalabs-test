import { Express, Router } from 'express';
import { readdirSync } from 'fs';
import path from 'path';

export const setupRoutes = (app: Express): void => {
  const router = Router();
  app.use('/api/v1/', router);

  const dirs = path.resolve(__dirname, '..', '..', '..', 'main');

  readdirSync(dirs).map(async (pasta) => {
    const routesDir = path.resolve(__dirname, '..', '..', '..', 'main', `${pasta}`);
    readdirSync(routesDir).map(async (fileName) => {
      if (
        ['.routes.ts', '.routes.js'].some((endRouter) =>
          fileName.endsWith(endRouter)
        )
      ) {
        (await import(`../../../main/${pasta}/${fileName}`)).default(router);
      };
    });
  });
};
