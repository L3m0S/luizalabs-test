import { Customer } from '@domain/entities/Customer';
import { CreateCustomerDTO } from '../dtos/CreateCustomerInputDTO';

export interface ICustomerService {
	create(customer: Customer): Promise<Customer>;
	getById(id: number): Promise<Customer>;
	deleteById(id: number): Promise<void>;
	update(id: number, customerDTO: CreateCustomerDTO): Promise<Customer>;
	getAllPaginated(page: number, size: number): Promise<[Customer[], number]>;
}
