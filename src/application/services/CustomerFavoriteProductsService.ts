import { CreateCustomerFavoriteProductsDTO } from '@application/dtos/CreateCustomerFavoriteProductsDTO';
import { ApiError } from '@application/helpers/ApiError';
import { ICustomerFavoriteProductsRepository } from '@application/interfaces/ICustomerFavoriteProductsRepository';
import { ICustomerFavoriteProductService } from '@application/interfaces/ICustomerFavoriteProductsService';
import { ICustomerService } from '@application/interfaces/ICustomerService';
import { IProductService } from '@application/interfaces/IProductService';
import { CustomerFavoriteProduct } from '@domain/entities/CustomerFavoriteProduct';
import { CustomerFavoriteProductsRepository } from '@infra/database/repositories/CustomerFavoriteProductRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CustomerFavoriteProductService implements ICustomerFavoriteProductService {
	private customerFavoriteProductsRepository: ICustomerFavoriteProductsRepository;

	constructor(
		@inject('IProductService')
		private productService: IProductService,
		@inject('ICustomerService')
		private customerService: ICustomerService,
	) {
		this.customerFavoriteProductsRepository = CustomerFavoriteProductsRepository;
	}

	async create(
		favoriteProductDTO: CreateCustomerFavoriteProductsDTO,
	): Promise<CustomerFavoriteProduct> {
		await this.validateCreateCreateCustomerFavoriteProduct(favoriteProductDTO);

		const { customerId, productId } = favoriteProductDTO;

		const customer = await this.customerService.getById(customerId);

		if (!customer) {
			throw new ApiError('Customer not found', 404);
		}

		const product = await this.productService.getById(productId);

		if (!product) {
			throw new ApiError('Product not found', 404);
		}

		const favoriteProduct: CustomerFavoriteProduct = {
			customer: customer,
			product: product,
		};

		return await this.customerFavoriteProductsRepository.save(favoriteProduct);
	}

	private async validateCreateCreateCustomerFavoriteProduct(
		favoriteProductDTO: CreateCustomerFavoriteProductsDTO,
	) {
		const { customerId, productId } = favoriteProductDTO;

		if (!customerId) {
			throw new ApiError("Key 'customerId' is required", 400);
		}

		if (!productId) {
			throw new ApiError("Key 'productId' is required", 400);
		}

		const favoriteProduct = await this.customerFavoriteProductsRepository.findOneBy({
			customer: {
				id: customerId,
			},
			product: {
				externalProductId: productId,
			},
		});

		if (favoriteProduct) {
			throw new ApiError('Product already added as favorite for this customer', 404);
		}
	}

	async deleteById(id: number): Promise<void> {
		const favoriteProduct = await this.customerFavoriteProductsRepository.findOneBy({ id });

		if (!favoriteProduct) {
			throw new ApiError('Favorited product not found', 404);
		}

		await this.customerFavoriteProductsRepository.delete(id);
	}

	public async findAllByCustomerIdPaginated(
		customerId: number,
		page: number,
		size: number,
	): Promise<[CustomerFavoriteProduct[], number]> {
		if (!customerId) {
			throw new ApiError('Customer ID not provided', 400);
		}

		const customer = await this.customerService.getById(customerId);

		if (!customer) {
			throw new ApiError('Customer not found', 404);
		}

		const DEFAULT_PAGE = 1;
		const pageSize = +size || process.env.DEFAULT_PAGE_SIZE!;

		const currentPage = +page || DEFAULT_PAGE;

		const skip = +pageSize * (currentPage - 1);

		return this.customerFavoriteProductsRepository.findAndCount({
			where: {
				customer: {
					id: customerId,
				},
			},
			relations: {
				product: true,
			},
			skip: +skip,
			take: +pageSize,
		});
	}
}
