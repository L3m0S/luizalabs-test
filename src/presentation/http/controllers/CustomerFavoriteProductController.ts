import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CreateCustomerFavoriteProductsDTO } from '@application/dtos/CreateCustomerFavoriteProductsDTO';
import { ICustomerFavoriteProductService } from '@application/interfaces/ICustomerFavoriteProductsService';
import { IPage } from '../interfaces/IPage';
import { CustomerFavoriteProductMapper } from '@application/mappers/CustomerFavoriteProductMapper';
import { CustomerFavoriteProductDTO } from '@application/dtos/CustomerFavoriteDTO';

@injectable()
export class CustomerFavoriteProductController {
	constructor(
		@inject('ICustomerFavoriteProductService')
		private readonly customerFavoriteProductService: ICustomerFavoriteProductService,
	) {}

	public async create(req: Request, res: Response) {
		const dto: CreateCustomerFavoriteProductsDTO = {
			customerId: +req.params['customerId'],
			productId: +req.body['productId'],
		};
		res
			.status(200)
			.send(
				CustomerFavoriteProductMapper.toDTO(
					await this.customerFavoriteProductService.create(dto),
				),
			);
	}

	public async deleteById(req: Request, res: Response) {
		const { favoriteId } = req.params;
		res.status(200).send(await this.customerFavoriteProductService.deleteById(+favoriteId));
	}

	public async findAllByCustomerIdPaginated(req: Request, res: Response) {
		const { customerId } = req.params;
		const { page, size } = req.query;
		const [products, total] =
			await this.customerFavoriteProductService.findAllByCustomerIdPaginated(
				+customerId,
				+page!,
				+size!,
			);

		const response: IPage<CustomerFavoriteProductDTO> = {
			content: CustomerFavoriteProductMapper.entityListToDTOList(products),
			pageNumber: +page! || 1,
			pageSize: +size! || +process.env.DEFAULT_PAGE_SIZE!,
			totalElements: total,
			totalPages: Math.ceil(total / (+size! || +process.env.DEFAULT_PAGE_SIZE!)),
		};

		res.status(200).send(response);
	}
}
