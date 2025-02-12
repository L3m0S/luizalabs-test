import { describe, it, expect, vi } from 'vitest';
import { ApiError } from '@application/helpers/ApiError';
import { CustomerFavoriteProduct } from '@domain/entities/CustomerFavoriteProduct';
import { CreateCustomerFavoriteProductsDTO } from '@application/dtos/CreateCustomerFavoriteProductsDTO';
import { CustomerFavoriteProductService } from '@application/services/CustomerFavoriteProductsService';
import { Product } from '@domain/entities/Product';
import { Customer } from '@domain/entities/Customer';

const productServiceMock = {
	getById: vi.fn(),
};

const customerServiceMock = {
	getById: vi.fn(),
	create: vi.fn(),
	deleteById: vi.fn(),
	update: vi.fn(),
	getAllPaginated: vi.fn(),
};

const customerFavoriteProductsRepositoryMock = {
	save: vi.fn(),
	findOneBy: vi.fn(),
	delete: vi.fn(),
	findAndCount: vi.fn(),
};

describe('CustomerFavoriteProductService', () => {
	let customerFavoriteProductService: CustomerFavoriteProductService;
	beforeEach(() => {
		vi.clearAllMocks();
		customerFavoriteProductService = new CustomerFavoriteProductService(
			productServiceMock,
			customerServiceMock,
		);
		// (Accessing a private property for testing purposes.)
		(customerFavoriteProductService as any).customerFavoriteProductsRepository =
			customerFavoriteProductsRepositoryMock;
	});

	describe('create', () => {
		const validCustomerFavoriteProductDTO: CreateCustomerFavoriteProductsDTO = {
			customerId: 1,
			productId: 2,
		};

		const validCustomer: Customer = {
			id: 1,
			name: 'test',
			email: 'test@test.com',
		};
		const validProduct: Product = {
			id: 2,
			externalProductId: 1,
			description: 'test description',
			image: 'test image',
			price: 1,
			title: 'test title',
			lastUpdateDate: new Date(),
		};

		it('should successfully create a favorite product when valid data is provided', async () => {
			const favoriteProduct: CustomerFavoriteProduct = {
				customer: validCustomer,
				product: validProduct,
			};
			customerServiceMock.getById.mockResolvedValue(validCustomer);
			productServiceMock.getById.mockResolvedValue(validProduct);

			customerFavoriteProductsRepositoryMock.findOneBy.mockResolvedValueOnce(null);
			customerFavoriteProductsRepositoryMock.save.mockResolvedValueOnce(favoriteProduct);

			const result = await customerFavoriteProductService.create(
				validCustomerFavoriteProductDTO,
			);

			expect(customerFavoriteProductsRepositoryMock.save).toHaveBeenCalledWith(
				favoriteProduct,
			);
			expect(result).toEqual(favoriteProduct);
		});

		it('should throw error if customer not found', async () => {
			customerServiceMock.getById.mockResolvedValue(null);

			await expect(
				customerFavoriteProductService.create(validCustomerFavoriteProductDTO),
			).rejects.toThrowError('Customer not found');
			expect(customerServiceMock.getById).toBeCalledWith(
				validCustomerFavoriteProductDTO.customerId,
			);
		});

		it('should throw error if product not found', async () => {
			customerServiceMock.getById.mockResolvedValue({ id: 1 });
			productServiceMock.getById.mockResolvedValueOnce(null);

			await expect(
				customerFavoriteProductService.create(validCustomerFavoriteProductDTO),
			).rejects.toThrowError('Product not found');
			expect(productServiceMock.getById).toBeCalledWith(
				validCustomerFavoriteProductDTO.productId,
			);
		});

		it('should throw error if product is already favorited', async () => {
			customerServiceMock.getById.mockResolvedValue({ id: 1 });
			productServiceMock.getById.mockResolvedValueOnce({ id: 2 });
			customerFavoriteProductsRepositoryMock.findOneBy.mockResolvedValueOnce({
				customer: validCustomer,
				product: validProduct,
			});

			await expect(
				customerFavoriteProductService.create(validCustomerFavoriteProductDTO),
			).rejects.toThrowError('Product already added as favorite for this customer');
			expect(customerFavoriteProductsRepositoryMock.findOneBy).toHaveBeenCalledWith({
				customer: {
					id: validCustomer.id,
				},
				product: {
					externalProductId: validProduct.id,
				},
			});
		});

		it('should throw error if customer ID is not provided', async () => {
			const invalidCustomerFavoriteProduct = {
				customerId: null,
			} as any as CreateCustomerFavoriteProductsDTO;
			await expect(
				customerFavoriteProductService.create(invalidCustomerFavoriteProduct),
			).rejects.toThrowError('Key "customerId" is required');
		});

		it('should throw error if product ID is not provided', async () => {
			const invalidCustomerFavoriteProduct = {
				customerId: 1,
				productId: null,
			} as any as CreateCustomerFavoriteProductsDTO;
			await expect(
				customerFavoriteProductService.create(invalidCustomerFavoriteProduct),
			).rejects.toThrowError('Key "productId" is required');
		});
	});

	describe('findAllByCustomerIdAndCount', async () => {
		it('should throw error if customerId is not provided', async () => {
			await expect(
				customerFavoriteProductService.findAllByCustomerIdAndCount(0),
			).rejects.toThrowError('Customer ID not provided');
		});

		it('should throw error if customer not found', async () => {
			customerServiceMock.getById.mockResolvedValue(null);

			await expect(
				customerFavoriteProductService.findAllByCustomerIdAndCount(1),
			).rejects.toThrowError('Customer not found');
		});

		it('should call "findAllByCustomerIdAndCount" with "pageableOptions" with "skip" and "take" properties if valid "page" and "size" are present', async () => {
			const customerId = 1;
			const page = 1;
			const size = 10;

			const favoriteProducts = [
				{ id: 1, customer: {}, product: {} },
				{ id: 2, customer: {}, product: {} },
			];

			customerServiceMock.getById.mockResolvedValue({ id: customerId });
			customerFavoriteProductsRepositoryMock.findAndCount.mockResolvedValue([
				favoriteProducts,
				2,
			]);

			await customerFavoriteProductService.findAllByCustomerIdAndCount(customerId, page, size);

			expect(customerFavoriteProductsRepositoryMock.findAndCount).toHaveBeenLastCalledWith(
				expect.objectContaining({
					skip: page,
					take: size,
				}),
			);
		});

		it('should return all product if the page and size are not provided', async () => {
			const customerId = 1;

			const favoriteProducts = [
				{ id: 1, customer: {}, product: {} },
				{ id: 2, customer: {}, product: {} },
			];

			customerServiceMock.getById.mockResolvedValue({ id: customerId });
			customerFavoriteProductsRepositoryMock.findAndCount.mockResolvedValue([
				favoriteProducts,
				2,
			]);

			await customerFavoriteProductService.findAllByCustomerIdAndCount(customerId);

			expect(customerFavoriteProductsRepositoryMock.findAndCount).toHaveBeenLastCalledWith(
				expect.not.objectContaining({
					skip: expect.anything(),
					take: expect.anything(),
				}),
			);
		});

		it('should call "findAndCount" with "pageableOptions" with page property if a valid "page" is provided', async () => {
			const page = 1;
			await customerFavoriteProductService.findAllByCustomerIdAndCount(1, page);
			expect(customerFavoriteProductsRepositoryMock.findAndCount).toHaveBeenCalledWith(
				expect.objectContaining({
					skip: page,
				}),
			);
		});

		it('should call "findAndCount" with "pageableOptions" with page property if a valid "size" is provided', async () => {
			const size = 1;
			await customerFavoriteProductService.findAllByCustomerIdAndCount(1, undefined, size);
			expect(customerFavoriteProductsRepositoryMock.findAndCount).toHaveBeenCalledWith(
				expect.objectContaining({
					take: size,
				}),
			);
		});
	});

	describe('deleteById', () => {
		it('should throw error if favorite product not found', async () => {
			customerFavoriteProductsRepositoryMock.findOneBy.mockResolvedValue(null);

			await expect(customerFavoriteProductService.deleteById(1)).rejects.toThrowError(
				'Favorited product not found',
			);
		});

		it('should successfully delete favorite product', async () => {
			const customer: Customer = {
				id: 1,
				name: 'test',
				email: 'test@test.com',
			};
			const product: Product = {
				id: 1,
				externalProductId: 1,
				description: 'test description',
				image: 'test image',
				price: 1,
				title: 'test title',
				lastUpdateDate: new Date(),
			};
			const favoriteProduct: CustomerFavoriteProduct = {
				id: 1,
				customer: customer,
				product: product,
			};

			customerFavoriteProductsRepositoryMock.findOneBy.mockResolvedValue(favoriteProduct);
			customerFavoriteProductsRepositoryMock.delete.mockResolvedValue(undefined);

			await customerFavoriteProductService.deleteById(1);

			expect(customerFavoriteProductsRepositoryMock.delete).toHaveBeenCalledWith(1);
		});
	});
});
