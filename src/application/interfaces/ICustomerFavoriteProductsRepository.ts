import { CustomerFavoriteProduct } from '@domain/entities/CustomerFavoriteProduct';
import { Repository } from 'typeorm';

export interface ICustomerFavoriteProductsRepository
	extends Repository<CustomerFavoriteProduct> {}
