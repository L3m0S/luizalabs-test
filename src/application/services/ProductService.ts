import { ApiError } from '@application/helpers/ApiError';
import { IProductRepository } from '@application/interfaces/IProductRepository';
import { IProdutcsApiProvider } from '@application/interfaces/IProductsApiProvider';
import { IProductService } from '@application/interfaces/IProductService';
import { Product } from '@domain/entities/Product';
import { ProductRepository } from '@infra/database/repositories/ProductRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ProductService implements IProductService {
	private readonly productRepository: IProductRepository;
	private readonly productPriceTtl: number = +process?.env?.TTL_DB_PRODUCT_CACHE_MS!;

	constructor(
		@inject('IProdutcsApiProvider')
		private readonly productsApiProvider: IProdutcsApiProvider,
	) {
		this.productRepository = ProductRepository;
	}

	public async getById(id: number): Promise<Product> {
		if (!id) {
			throw new ApiError('Id is required', 400);
		}

		const product = await this.productRepository.findOneBy({ externalProductId: id });

		if (product && this.isPriceCacheValid(product.lastUpdateDate!)) {
			return product;
		}

		return await this.fetchAndUpdateProduct(id, product);
	}

	private async fetchAndUpdateProduct(
		id: number,
		existingProduct: Product | null,
	): Promise<Product> {
		const externalProduct = await this.productsApiProvider.getData(`/${id}`);

		if (!externalProduct) {
			throw new ApiError('Product not found', 404);
		}

		const productData: Product = {
			id: existingProduct?.id,
			description: externalProduct.description,
			externalProductId: externalProduct.id,
			image: externalProduct.image,
			price: externalProduct.price,
			title: externalProduct.title,
			lastUpdateDate: new Date(),
		};

		return await this.productRepository.save(productData);
	}

	private isPriceCacheValid(lastUpdateDate: Date): boolean {
		const now = new Date().getTime();
		const lastUpdate = new Date(lastUpdateDate).getTime();
		return now - lastUpdate < this.productPriceTtl;
	}
}
