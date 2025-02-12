import { CreateCustomerFavoriteProductsDTO } from '@application/dtos/CreateCustomerFavoriteProductsDTO';
import { CustomerFavoriteProduct } from '@domain/entities/CustomerFavoriteProduct';

export interface ICustomerFavoriteProductService {
	create(
		favoriteProductDTO: CreateCustomerFavoriteProductsDTO,
	): Promise<CustomerFavoriteProduct>;
	deleteById(id: number): Promise<void>;
	findAllByCustomerIdAndCount(
		customerId: number,
		page: number,
		size: number,
	): Promise<[CustomerFavoriteProduct[], number]>;
}
