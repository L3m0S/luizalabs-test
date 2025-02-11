import { Customer } from '@domain/entities/Customer';
import { CustomerDTO } from '../dtos/CustomerDTO';

export class CustomerMaper {
	public static toDTO(customer: Customer): CustomerDTO {
		const { id, name, email } = customer;
		return { id: id!, name: name!, email: email! };
	}

	public static entityListToDTOList(customers: Customer[]): CustomerDTO[] {
		return customers.map((customer) => CustomerMaper.toDTO(customer));
	}
}
