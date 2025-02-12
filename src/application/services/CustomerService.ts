import { CustomerRepository } from '@infra/database/repositories/CustomerRepository';
import { injectable } from 'tsyringe';
import { CreateCustomerDTO } from '../dtos/CreateCustomerInputDTO';
import { ICustomerRepository } from '../interfaces/ICustomerRepository';
import { ICustomerService } from '../interfaces/ICustomerService';
import { Customer } from '@domain/entities/Customer';
import { ApiError } from '@application/helpers/ApiError';

@injectable()
export class CustomerService implements ICustomerService {
	private customerRepository: ICustomerRepository;

	constructor() {
		this.customerRepository = CustomerRepository;
	}

	public async create(customer: CreateCustomerDTO): Promise<Customer> {
		await this.validateCustomer(customer);

		if (await this.customerRepository.findOneBy({ email: customer.email })) {
			throw new ApiError('Email already exists', 400);
		}

		return await this.customerRepository.save(customer);
	}

	private async validateCustomer(customerInput: Customer): Promise<void> {
		const { name, email } = customerInput;

		if (!name) {
			throw new ApiError('Name is required', 400);
		}

		if (!email) {
			throw new ApiError('Email is required', 400);
		}

		const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!EMAIL_REGEX.test(email)) {
			throw new ApiError('Invalid email format', 400);
		}
	}

	public async getById(id: number): Promise<Customer> {
		const customer = await this.customerRepository.findOneBy({ id });

		if (!customer) {
			throw new ApiError('Customer not found', 404);
		}

		return customer;
	}

	public async deleteById(id: number): Promise<void> {
		const customer = await this.customerRepository.findOneBy({ id });

		if (!customer) {
			throw new ApiError('Customer not found', 404);
		}

		await this.customerRepository.delete({ id });
	}

	public async update(id: number, customerDTO: CreateCustomerDTO): Promise<Customer> {
		const customer = await this.customerRepository.findOneBy({ id });

		if (!customer) {
			throw new ApiError('Customer not found', 404);
		}

		if (await this.customerRepository.findByEmailExcludingId(customerDTO.email, id!)) {
			throw new ApiError('Email already registered', 400);
		}

		const updateCustomer = { id: customer.id, ...customerDTO };

		await this.validateCustomer(updateCustomer);

		return await this.customerRepository.save(updateCustomer);
	}

	public async getAllPaginated(page?: number, size?: number): Promise<[Customer[], number]> {
		const pageableOptions: {
			skip?: number;
			take?: number;
		} = {};

		if (page && page >= 0) {
			pageableOptions.skip = page;
		}

		if (size && size >= 0) {
			pageableOptions.take = size;
		}

		return this.customerRepository.findAndCount(pageableOptions);
	}
}
