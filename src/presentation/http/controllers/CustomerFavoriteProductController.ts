import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { CreateCustomerFavoriteProductsDTO } from '@application/dtos/CreateCustomerFavoriteProductsDTO';
import { ICustomerFavoriteProductService } from '@application/interfaces/ICustomerFavoriteProductsService';
import { IPage } from '../interfaces/IPage';
import { CustomerFavoriteProductMapper } from '@application/mappers/CustomerFavoriteProductMapper';
import { CustomerFavoriteProductDTO } from '@application/dtos/CustomerFavoriteDTO';
import { PaginationHelper } from '@application/helpers/Paginationhelper';

@injectable()
export class CustomerFavoriteProductController {
  constructor(
    @inject('ICustomerFavoriteProductService')
    private readonly customerFavoriteProductService: ICustomerFavoriteProductService,
  ) { }

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
    const { externalProductId } = req.params;
    res.status(200).send(await this.customerFavoriteProductService.deleteById(+externalProductId));
  }

  public async findAllByCustomerIdPaginated(req: Request, res: Response) {
    const { customerId } = req.params;
    const { page, size } = req.query;

    const { skip, pageSize } = PaginationHelper.parsePagination({
      page: +page!,
      pageSize: +size!,
    });

    const [products, total] =
      await this.customerFavoriteProductService.findAllByCustomerIdAndCount(
        +customerId,
        skip,
        pageSize,
      );

    const response: IPage<CustomerFavoriteProductDTO> = {
      content: CustomerFavoriteProductMapper.entityListToDTOList(products),
      pageNumber: +page! || 1,
      pageSize: pageSize,
      totalElements: total,
      totalPages: Math.ceil(total / pageSize),
    };

    res.status(200).send(response);
  }
}
