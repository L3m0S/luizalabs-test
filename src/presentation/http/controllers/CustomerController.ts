import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { IPage } from '@presentation/http/interfaces/IPage';
import { Customer } from 'domain/entities/Customer';
import { CustomerService } from '@application/services/CustomerService';
import { CustomerMaper } from '@application/mappers/customersMapper';
import { CreateCustomerDTO } from '@application/dtos/CreateCustomerInputDTO';
import { ICustomerService } from '@application/interfaces/ICustomerService';

@injectable()
export class CustomerController {
	constructor(@inject(CustomerService) private readonly customerService: ICustomerService) {}

	public async create(req: Request, res: Response) {
		const customer: CreateCustomerDTO = req.body;
		const createdCustomer = CustomerMaper.toDTO(await this.customerService.create(customer));
		res.status(200).send(createdCustomer);
	}

	public async getById(req: Request, res: Response) {
		const { id } = req.params;
		const customer = CustomerMaper.toDTO(await this.customerService.getById(+id));
		res.status(200).send(customer);
	}

	public async deleteById(req: Request, res: Response) {
		const { id } = req.params;
		await this.customerService.deleteById(+id);
		res.status(204).send();
	}

	public async update(req: Request, res: Response) {
		const { id } = req.params;
		const customer: CreateCustomerDTO = req.body;
		const updatedCustomer = CustomerMaper.toDTO(
			await this.customerService.update(+id, customer),
		);
		res.status(200).send(updatedCustomer);
	}

	public async getAllPaginated(req: Request, res: Response) {
		const { page, size } = req.query;
		const [customers, total] = await this.customerService.getAllPaginated(+page!, +size!);

		const response: IPage<Customer> = {
			content: CustomerMaper.entityListToDTOList(customers),
			pageNumber: +page! || 1,
			pageSize: +size! || +process.env.DEFAULT_PAGE_SIZE!,
			totalElements: total,
			totalPages: Math.ceil(total / +size!),
		};

		res.status(200).send(response);
	}
}
