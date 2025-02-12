import 'reflect-metadata';
import { CustomerService } from '@application/services/CustomerService';
import { CreateCustomerDTO } from '@application/dtos/CreateCustomerInputDTO';
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
		it('should create a customer successfully when valid data is provided', async () => {
			const validCustomerDTO: CreateCustomerDTO = {
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};

			mockCustomerRepository.findOneBy.mockResolvedValueOnce(null);
			const createdCustomer: Customer = {
				id: 1,
				...validCustomerDTO,
			};
			mockCustomerRepository.save.mockResolvedValueOnce(createdCustomer);

			const result = await customerService.create(validCustomerDTO);

			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledWith({
				email: validCustomerDTO.email,
			});
			expect(mockCustomerRepository.save).toHaveBeenCalledWith(validCustomerDTO);
			expect(result).toEqual(createdCustomer);
		});

		it('should throw an error if name is a empty string', async () => {
			const customerWithEmptyStringName: CreateCustomerDTO = {
				name: '',
				email: 'testeDaSilva@teste.com',
			};

			await expect(customerService.create(customerWithEmptyStringName)).rejects.toThrowError(
				'Name is required',
			);
		});

		it('should throw an error if name is missing', async () => {
			const customerWithEmptyStringName = {
				email: 'testeDaSilva@teste.com',
			} as any as CreateCustomerDTO;

			await expect(customerService.create(customerWithEmptyStringName)).rejects.toThrowError(
				'Name is required',
			);
		});

		it('should throw an error if email is a empty string', async () => {
			const customerWithEmptyStringEmail: CreateCustomerDTO = {
				name: 'Teste da silva',
				email: '',
			};

			await expect(customerService.create(customerWithEmptyStringEmail)).rejects.toThrowError(
				'Email is required',
			);
		});

		it('should throw an error if email is missing', async () => {
			const customerWithEmptyStringEmail = {
				name: 'Teste da silva',
			} as any as CreateCustomerDTO;

			await expect(customerService.create(customerWithEmptyStringEmail)).rejects.toThrowError(
				'Email is required',
			);
		});

		it('should throw an error if email already exists', async () => {
			const validCustomerDTO: CreateCustomerDTO = {
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};

			mockCustomerRepository.findOneBy.mockResolvedValueOnce({
				id: 2,
				name: 'Existing Customer',
				email: validCustomerDTO.email,
			});

			await expect(customerService.create(validCustomerDTO)).rejects.toThrowError(
				'Email already exists',
			);
		});
	});

	describe('getById', () => {
		it('should return a customer when valid ID is provided', async () => {
			const EXISTING_CUSTOMER_ID = 1;
			const existingCustomer: Customer = {
				id: EXISTING_CUSTOMER_ID,
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};
			mockCustomerRepository.findOneBy.mockResolvedValueOnce(existingCustomer);

			const result = await customerService.getById(EXISTING_CUSTOMER_ID);
			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledWith({
				id: EXISTING_CUSTOMER_ID,
			});
			expect(result).toEqual(existingCustomer);
		});

		it('should throw an error if the customer is not found', async () => {
			const EXISTING_CUSTOMER_ID = 1;
			mockCustomerRepository.findOneBy.mockResolvedValueOnce(null);
			await expect(customerService.getById(EXISTING_CUSTOMER_ID)).rejects.toThrowError(
				'Customer not found',
			);
		});
	});

	describe('deleteById', () => {
		it('should delete the customer when valid ID is provided', async () => {
			const EXISTING_CUSTOMER_ID = 1;
			const existingCustomer: Customer = {
				id: EXISTING_CUSTOMER_ID,
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};
			mockCustomerRepository.findOneBy.mockResolvedValueOnce(existingCustomer);
			mockCustomerRepository.delete.mockResolvedValueOnce(null);

			await customerService.deleteById(EXISTING_CUSTOMER_ID);
			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledWith({
				id: EXISTING_CUSTOMER_ID,
			});
			expect(mockCustomerRepository.delete).toHaveBeenCalledWith({ id: EXISTING_CUSTOMER_ID });
		});

		it('Should throw an error if the customer is not found', async () => {
			const INVALID_CUSTOMER_ID = 1;
			mockCustomerRepository.findOneBy.mockResolvedValueOnce(null);
			await expect(customerService.deleteById(INVALID_CUSTOMER_ID)).rejects.toThrowError(
				'Customer not found',
			);
		});
	});

	describe('update', () => {
		it('Should update the customer if exists and valid data is provided', async () => {
			const EXISTING_CUSTOMER_ID = 1;
			const existingCustomer: Customer = {
				id: EXISTING_CUSTOMER_ID,
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};

			mockCustomerRepository.findOneBy.mockResolvedValueOnce(existingCustomer);
			mockCustomerRepository.findByEmailExcludingId.mockResolvedValueOnce(null);

			const validCustomerDTO: CreateCustomerDTO = {
				name: 'Teste da silva',
				email: 'testeDaSilva123@teste.com',
			};

			const updatedCustomer: Customer = {
				...existingCustomer,
				...validCustomerDTO,
			};
			mockCustomerRepository.save.mockResolvedValue(updatedCustomer);

			const result = await customerService.update(1, validCustomerDTO);

			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledTimes(1);
			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledWith({
				id: EXISTING_CUSTOMER_ID,
			});

			expect(mockCustomerRepository.findByEmailExcludingId).toHaveBeenCalledTimes(1);
			expect(mockCustomerRepository.findByEmailExcludingId).toHaveBeenCalledWith(
				validCustomerDTO.email,
				EXISTING_CUSTOMER_ID,
			);

			expect(result).toEqual(updatedCustomer);
		});

		it('Should throw an error if the customer to update is not found', async () => {
			const INVALID_CUSTOMER_ID = 1;
			mockCustomerRepository.findOneBy.mockResolvedValue(null);
			const validateCustomerDTO: CreateCustomerDTO = {
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			};

			await expect(
				customerService.update(INVALID_CUSTOMER_ID, validateCustomerDTO),
			).rejects.toThrowError('Customer not found');

			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledTimes(1);
			expect(mockCustomerRepository.findOneBy).toHaveBeenCalledWith({
				id: INVALID_CUSTOMER_ID,
			});
		});

		it('Should throw an error if the email is already registered', async () => {
			const EXISTING_CUSTOMER_ID = 1;
			const existingCustomer: Customer = {
				id: EXISTING_CUSTOMER_ID,
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

			const customerInputDTO: CreateCustomerDTO = {
				name: 'Teste da silva',
				email: 'testeDaSilva2@teste.com',
			};
			await expect(
				customerService.update(EXISTING_CUSTOMER_ID, customerInputDTO),
			).rejects.toThrowError('Email already registered');
		});
	});

	describe('getAllAndCount', () => {
		const customers: Customer[] = [
			{
				id: 1,
				name: 'Teste da silva',
				email: 'testeDaSilva@teste.com',
			},
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

		it('should call "findAndCount" with "pageableOptions" with "skip" and "take" properties if valid "page" and "size" are present', async () => {
			mockCustomerRepository.findAndCount.mockResolvedValue([customers, customers.length]);

			const page = 1;
			const size = 10;
			const [resultCustomers, total] = await customerService.getAllPaginated(page, size);

			expect(mockCustomerRepository.findAndCount).toHaveBeenCalledWith({
				skip: page,
				take: size,
			});
			expect(resultCustomers).toEqual(customers);
			expect(total).toBe(customers.length);
		});

		it('should return all customers if the page and size are not provided', async () => {
			mockCustomerRepository.findAndCount.mockResolvedValue([customers, customers.length]);

			const [resultCustomers, total] = await customerService.getAllPaginated();

			expect(mockCustomerRepository.findAndCount).toHaveBeenCalledWith({});
			expect(resultCustomers).toEqual(customers);
			expect(total).toBe(customers.length);
		});

		it('should call "findAndCount" with "pageableOptions" with page property if a valid "page" is provided', async () => {
			await customerService.getAllPaginated(1);
			expect(mockCustomerRepository.findAndCount).toHaveBeenCalledWith({
				skip: 1,
			});
		});

		it('should call "findAndCount" with "pageableOptions" with page property if a valid "size" is provided', async () => {
			await customerService.getAllPaginated(undefined, 1);
			expect(mockCustomerRepository.findAndCount).toHaveBeenCalledWith({
				take: 1,
			});
		});
	});
});
