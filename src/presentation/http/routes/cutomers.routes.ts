import 'reflect-metadata';
import { Router } from 'express';
import { container } from 'tsyringe';
import { CustomerController } from '@presentation/http/controllers/CustomerController';
import { CustomerFavoriteProductController } from '../controllers/CustomerFavoriteProductController';

const customerController: CustomerController = container.resolve(CustomerController);
const customerFavoriteProductController = container.resolve(CustomerFavoriteProductController);

export default (router: Router): void => {
  const customersRouter = Router();
  router.use('/customers', customersRouter);

  customersRouter.post('/', customerController.create.bind(customerController));

  customersRouter.get('/:id', customerController.getById.bind(customerController));

  customersRouter.delete('/:id', customerController.deleteById.bind(customerController));

  customersRouter.put('/:id', customerController.update.bind(customerController));

  customersRouter.get('/', customerController.getAllPaginated.bind(customerController));

  customersRouter.post(
    '/:customerId/favorites',
    customerFavoriteProductController.create.bind(customerFavoriteProductController),
  );

  customersRouter.delete(
    '/:customerId/favorites/:favoriteId',
    customerFavoriteProductController.deleteById.bind(customerFavoriteProductController),
  );

  customersRouter.get(
    '/:customerId/favorites',
    customerFavoriteProductController.findAllByCustomerIdPaginated.bind(
      customerFavoriteProductController,
    ),
  );
};
