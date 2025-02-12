import { Router } from 'express';
import { serve, setup } from 'swagger-ui-express';
const swaggerFile = require('./swagger.json');

export default (router: Router): void => {
  const docsRouter = Router();
  docsRouter.use('/', serve);
  router.use('/api-docs', docsRouter);

  docsRouter.get('/', setup(swaggerFile));
};
