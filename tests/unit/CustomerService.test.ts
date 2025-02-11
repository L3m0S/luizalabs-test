import 'reflect-metadata';
import { CustomerService } from '@application/services/CustomerService';
import { CreateCustomerDTO } from '@application/dtos/CreateCustomerInputDTO';
import { ApiError } from '@application/helpers/ApiError';
import { Customer } from '@domain/entities/Customer';

const mockCustomerRepository = {
	save: vi.fn(),
	findOneBy: vi.fn(),
	delete: vi.fn(),
	findAndCount: vi.fn(),
	findByEmailExcludingId: vi.fn(),
};

describe('CustomerService', () => {
	let customerService: CustomerService;

	beforeEach(() => {
		customerService = new CustomerService();

		// (Accessing a private property for testing purposes.)
		(customerService as any).customerRepository = mockCustomerRepository;
		vi.clearAllMocks();
	});

	describe('create', () => {
		it('Should create a customer successfully when valid data is provided', async () => {
			const validCustomerData: CreateCustomerDTO = {
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};

			mockCustomerRepository.findOneBy.mockResolvedValueOnce(null);
			const createdCustomer: Customer = {
				id: 1,
				...validCustomerData,
			};
			mockCustomerRepository.save.mockResolvedValueOnce(createdCustomer);

			const result = await customerService.create(validCustomerData);
			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledWith({
				email: validCustomerData.email,
			});
			expect(mockCustomerRepository.save).toHaveBeenCalledWith(validCustomerData);
			expect(result).toEqual(createdCustomer);
		});

		it('Should throw an error if name is missing', async () => {
			const customerWithEmptyStringName: CreateCustomerDTO = {
				name: '',
				email: 'lemos.dev@teste.com',
			};

			await expect(customerService.create(customerWithEmptyStringName)).rejects.toThrowError(
				'Name is required',
			);
		});

		it('Should throw an error if email is missing', async () => {
			const customerWithEmptyStringEmail: CreateCustomerDTO = {
				name: 'Gabriel',
				email: '',
			};

			await expect(customerService.create(customerWithEmptyStringEmail)).rejects.toThrowError(
				'Email is required',
			);
		});

		it('Should throw an error if email already exists', async () => {
			const dto: CreateCustomerDTO = {
				name: 'Gabriel',
				email: 'lemos.dev@teste.com',
			};

			mockCustomerRepository.findOneBy.mockResolvedValueOnce({
				id: 2,
				name: 'Existing Customer',
				email: dto.email,
			});

			await expect(customerService.create(dto)).rejects.toThrowError('Email already exists');
		});
	});

	describe('getById', () => {
		it('Should return a customer when valid ID is provided', async () => {
			const customer: Customer = {
				id: 1,
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};
			mockCustomerRepository.findOneBy.mockResolvedValueOnce(customer);

			const VALID_CUSTOMER_ID = 1;

			const result = await customerService.getById(VALID_CUSTOMER_ID);
			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledWith({ id: VALID_CUSTOMER_ID });
			expect(result).toEqual(customer);
		});

		it('Should throw an error if the customer is not found', async () => {
			const INVALID_CUSTOMER_ID = 1;
			mockCustomerRepository.findOneBy.mockResolvedValueOnce(null);
			await expect(customerService.getById(INVALID_CUSTOMER_ID)).rejects.toThrowError(
				'Customer not found',
			);
		});
	});

	describe('deleteById', () => {
		it('Should delete the customer when valid ID is provided', async () => {
			const customer: Customer = {
				id: 1,
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};
			mockCustomerRepository.findOneBy.mockResolvedValueOnce(customer);
			mockCustomerRepository.delete.mockResolvedValueOnce(undefined);

			await customerService.deleteById(1);
			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
			expect(mockCustomerRepository.delete).toHaveBeenCalledWith({ id: 1 });
		});

		it('Should throw an error if the customer is not found', async () => {
			const INVALID_CUSTOMER_ID = 1;
			mockCustomerRepository.findOneBy.mockResolvedValueOnce(null);
			await expect(customerService.deleteById(INVALID_CUSTOMER_ID)).rejects.toThrow(ApiError);
		});
	});

	describe('Update', () => {
		it('Should update the customer if exists and valid data is provided', async () => {
			const existingCustomer: Customer = {
				id: 1,
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};

			mockCustomerRepository.findOneBy.mockResolvedValueOnce(existingCustomer);
			mockCustomerRepository.findByEmailExcludingId.mockResolvedValueOnce(null);

			const dto: CreateCustomerDTO = {
				name: 'Teste da silva',
				email: 'testeDaSilva123@teste.com',
			};

			const updatedCustomer: Customer = {
				id: 1,
				name: dto.name,
				email: dto.email,
			};
			mockCustomerRepository.save.mockResolvedValue(updatedCustomer);

			const result = await customerService.update(1, dto);

			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledTimes(1);
			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
			expect(mockCustomerRepository.findByEmailExcludingId).toHaveBeenCalledTimes(1);
			expect(mockCustomerRepository.findByEmailExcludingId).toHaveBeenCalledWith(dto.email, 1);
			expect(result).toEqual(updatedCustomer);
		});

		it('Should throw an error if the customer to update is not found', async () => {
			mockCustomerRepository.findOneBy.mockResolvedValue(null);
			const dto: CreateCustomerDTO = {
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};
			await expect(customerService.update(1, dto)).rejects.toThrow(ApiError);
		});

		it('Should throw an error if the email is already registered', async () => {
			const existingCustomer: Customer = {
				id: 1,
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};
			mockCustomerRepository.findOneBy.mockResolvedValueOnce(existingCustomer);

			const customerWithEmailAlreadyRegistered = {
				id: 2,
				name: 'Teste da silva 2',
				email: 'testeDaSilva2@teste.com',
			};
			mockCustomerRepository.findByEmailExcludingId.mockResolvedValueOnce(
				customerWithEmailAlreadyRegistered,
			);

			const dto: CreateCustomerDTO = {
				name: 'Teste da silva JR.',
				email: 'testeDaSilva2@teste.com',
			};
			await expect(customerService.update(1, dto)).rejects.toThrowError(
				'Email already registered',
			);
		});
	});

	describe('getAllPaginated', () => {
		it('Should return paginated customers when passed valid page and size', async () => {
			const customers: Customer[] = [
				{ id: 1, name: 'Teste da silva', email: 'testeDaSilva@teste.com' },
				{
					id: 2,
					name: 'Teste da silva Junior',
					email: 'testeDaSilvaJunior@teste.com',
				},
				{
					id: 3,
					name: 'Teste da silva III',
					email: 'testeDaSilvaTerceiro@teste.com',
				},
			];

			mockCustomerRepository.findAndCount.mockResolvedValue([customers, customers.length]);

			const page = 1;
			const size = 10;
			const [resultCustomers, total] = await customerService.getAllPaginated(page, size);

			expect(mockCustomerRepository.findAndCount).toHaveBeenCalled();
			expect(resultCustomers).toEqual(customers);
			expect(total).toBe(customers.length);
		});

		it('Should return paginated customer with a default page when page is not passed', async () => {
			const customers: Customer[] = [
				{ id: 1, name: 'Teste da silva', email: 'testeDaSilva@teste.com' },
				{
					id: 2,
					name: 'Teste da silva Junior',
					email: 'testeDaSilvaJunior@teste.com',
				},
				{
					id: 3,
					name: 'Teste da silva III',
					email: 'testeDaSilvaTerceiro@teste.com',
				},
			];

			mockCustomerRepository.findAndCount.mockResolvedValue([customers, customers.length]);

			const page = undefined;
			const size = 1;
			const [resultCustomers, total] = await customerService.getAllPaginated(page, size);

			expect(mockCustomerRepository.findAndCount).toHaveBeenCalledWith({
				skip: 0,
				take: 1,
			});
			expect(resultCustomers).toEqual(customers);
			expect(total).toBe(customers.length);
		});

		it('Should return paginated customer with a default page when page is not passed', async () => {
			const customers: Customer[] = [
				{ id: 1, name: 'Teste da silva', email: 'testeDaSilva@teste.com' },
				{
					id: 2,
					name: 'Teste da silva Junior',
					email: 'testeDaSilvaJunior@teste.com',
				},
				{
					id: 3,
					name: 'Teste da silva III',
					email: 'testeDaSilvaTerceiro@teste.com',
				},
			];

			mockCustomerRepository.findAndCount.mockResolvedValue([customers, customers.length]);

			const page = undefined;
			const size = 1;
			const [resultCustomers, total] = await customerService.getAllPaginated(page, size);

			expect(mockCustomerRepository.findAndCount).toHaveBeenCalledWith({
				skip: 0,
				take: 1,
			});
			expect(resultCustomers).toEqual(customers);
			expect(total).toBe(customers.length);
		});

		it('Should throw an error if the parameter "page" is negative', async () => {
			const page = -1;
			const size = 1;
			await expect(customerService.getAllPaginated(page, size)).rejects.toThrowError(
				"'page' parameter must be non-negative",
			);
		});

		it('Should throw an error if the parameter "size" is negative', async () => {
			const page = 1;
			const size = -1;
			await expect(customerService.getAllPaginated(page, size)).rejects.toThrowError(
				"'size' parameter must be non-negative",
			);
		});
	});
});
