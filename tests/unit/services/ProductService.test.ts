import 'reflect-metadata';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { ProductService } from '@application/services/ProductService';
import { Product } from '@domain/entities/Product';

const mockProductRepository = {
	findOneBy: vi.fn(),
	save: vi.fn(),
};

let mockProductsApiProvider = {
	getById: vi.fn(),
};

describe('ProductService', () => {
	let productService: ProductService;

	beforeEach(() => {
		productService = new ProductService(mockProductsApiProvider);

		// (Accessing a private property for testing purposes.)
		(productService as any).productRepository = mockProductRepository;
		vi.clearAllMocks();
	});

	describe('getById', () => {
		it('Should throw an error if ID is falsy', async () => {
			await expect(productService.getById(0)).rejects.toThrowError('Id is required');
		});

		it('should return the product from the repository if the cache is valid', async () => {
			const CACHED_PRODUCT_ID = 1;
			const cachedProduct: Product = {
				id: CACHED_PRODUCT_ID,
				description: 'Cached product',
				externalProductId: 1,
				image: 'cached.png',
				price: 100,
				title: 'Cached Product',
				lastUpdateDate: new Date(),
			};

			mockProductRepository.findOneBy.mockResolvedValue(cachedProduct);

			const result = await productService.getById(CACHED_PRODUCT_ID);
			expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ externalProductId: 1 });
			expect(result).toEqual(cachedProduct);
			expect(mockProductsApiProvider.getById).not.toHaveBeenCalled();
		});

		it('should fetch and update the product if the product exists but the cache is expired', async () => {
			const now = new Date();
			const expiredProduct: Product = {
				id: 1,
				description: 'Expired product',
				externalProductId: 1,
				image: 'expired.png',
				price: 50,
				title: 'Expired Product',
				lastUpdateDate: new Date(now.getTime() - 120000),
			};
			mockProductRepository.findOneBy.mockResolvedValue(expiredProduct);

			const externalProductData = {
				id: 1,
				description: 'Updated product',
				image: 'updated.png',
				price: 150,
				title: 'Updated Product',
			};
			mockProductsApiProvider.getById.mockResolvedValueOnce(externalProductData);

			const updatedProduct: Product = {
				id: expiredProduct.id,
				description: externalProductData.description,
				externalProductId: externalProductData.id,
				image: externalProductData.image,
				price: externalProductData.price,
				title: externalProductData.title,
				lastUpdateDate: new Date(),
			};
			mockProductRepository.save.mockResolvedValue(updatedProduct);

			const result = await productService.getById(1);
			expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ externalProductId: 1 });
			expect(mockProductsApiProvider.getById).toHaveBeenCalledWith(1);
			expect(mockProductRepository.save).toHaveBeenCalled();
			expect(result).toEqual(updatedProduct);
		});

		it('should fetch and update the product if it does not exist in the repository', async () => {
			mockProductRepository.findOneBy.mockResolvedValue(null);

			const externalProductData = {
				id: 2,
				description: 'New product',
				image: 'new.png',
				price: 200,
				title: 'New Product',
			};
			mockProductsApiProvider.getById.mockResolvedValue(externalProductData);

			const newProduct: Product = {
				id: undefined,
				description: externalProductData.description,
				externalProductId: externalProductData.id,
				image: externalProductData.image,
				price: externalProductData.price,
				title: externalProductData.title,
				lastUpdateDate: new Date(),
			};
			mockProductRepository.save.mockResolvedValue(newProduct);

			const result = await productService.getById(2);
			expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({ externalProductId: 2 });
			expect(mockProductsApiProvider.getById).toHaveBeenCalledWith(2);
			expect(mockProductRepository.save).toHaveBeenCalled();
			expect(result).toEqual(newProduct);
		});

		it('should throw an error if the external API does not return product data', async () => {
			const now = new Date();
			const expiredProduct: Product = {
				id: 1,
				description: 'Expired product',
				externalProductId: 1,
				image: 'expired.png',
				price: 50,
				title: 'Expired Product',
				lastUpdateDate: new Date(now.getTime() - 120000),
			};

			mockProductRepository.findOneBy.mockResolvedValue(expiredProduct);
			mockProductsApiProvider.getById.mockResolvedValue(null);

			await expect(productService.getById(1)).rejects.toThrowError('Product not found');
		});
	});
});
