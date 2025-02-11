import 'reflect-metadata';
import { Router } from 'express';
import { container } from 'tsyringe';
import { ProductController } from '../controllers/ProductController';

const productController: ProductController = container.resolve('ProductController');

export default (router: Router): void => {
	const customersRouter = Router();
	router.use('/products', customersRouter);

	customersRouter.get('/:id', productController.getById.bind(productController));
};
