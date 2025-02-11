import { Product } from '@domain/entities/Product';

export interface IProductService {
	getById(id: number): Promise<Product>;
}
