import { IProductRepository } from '@application/interfaces/IProductRepository';
import { AppDataSource } from '../Datasource';
import { Product } from '@domain/entities/Product';

export const ProductRepository: IProductRepository = AppDataSource.getRepository(
	Product,
).extend({});
