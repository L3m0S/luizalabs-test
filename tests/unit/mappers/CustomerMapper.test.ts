import { CreateCustomerDTO } from '@application/dtos/CreateCustomerInputDTO';
import { CustomerDTO } from '@application/dtos/CustomerDTO';
import { CustomerMaper } from '@application/mappers/customersMapper';
import { Customer } from '@domain/entities/Customer';

describe('CustomerMapper', () => {
	const customer: Customer = {
		id: 1,
		name: 'Teste da silva',
		email: 'testeDaSilva@teste.com',
	};

	const customers: Customer[] = [customer, customer];

	describe('toDTO', () => {
		it('should correctly map a CustomerFavoriteProduct entity to a DTO', () => {
			const result: CreateCustomerDTO = CustomerMaper.toDTO(customer);

			expect(result).toEqual({
				id: 1,
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			});
		});
	});

	describe('entityListToDTOList', () => {
		it('should correctly map a list of CustomerFavoriteProduct entities to DTOs', () => {
			const result = CustomerMaper.entityListToDTOList(customers);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual(CustomerMaper.toDTO(customer));
			expect(result[1]).toEqual(CustomerMaper.toDTO(customer));
		});

		it('should return an empty array when given an empty list', () => {
			const result = CustomerMaper.entityListToDTOList([]);

			expect(result).toEqual([]);
		});
	});
});
