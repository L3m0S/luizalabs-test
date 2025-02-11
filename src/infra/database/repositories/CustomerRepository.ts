import { AppDataSource } from '@infra/database/Datasource';
import { Customer } from '@domain/entities/Customer';
import { Not } from 'typeorm';
import { ICustomerRepository } from '@application/interfaces/ICustomerRepository';

export const CustomerRepository = AppDataSource.getRepository(Customer).extend({
	async findByEmailExcludingId(email: string, excludeId: number): Promise<Customer | null> {
		return await this.findOneBy({
			email: email,
			id: Not(excludeId),
		});
	},
}) as unknown as ICustomerRepository;
