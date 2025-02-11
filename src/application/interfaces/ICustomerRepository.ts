import { Customer } from '@domain/entities/Customer';
import { Repository } from 'typeorm';

export interface ICustomerRepository extends Repository<Customer> {
	findByEmailExcludingId(email: string, excludeId: number): Promise<Customer | null>;
}
