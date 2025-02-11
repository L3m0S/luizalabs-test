import { AppDataSource } from '@infra/database/Datasource';
import { CustomerFavoriteProduct } from '@domain/entities/CustomerFavoriteProduct';
import { ICustomerFavoriteProductsRepository } from '@application/interfaces/ICustomerFavoriteProductsRepository';

export const CustomerFavoriteProductsRepository: ICustomerFavoriteProductsRepository =
	AppDataSource.getRepository(CustomerFavoriteProduct).extend({});
