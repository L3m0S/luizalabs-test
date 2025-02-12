import axios, { AxiosInstance } from 'axios';
import { inject, injectable } from 'tsyringe';
import { IProdutcsApiProvider } from '@application/interfaces/IProductsApiProvider';
import { ICircuitBreakerProvider } from '@application/interfaces/ICircuitBreakerProvider';
import { IProduct } from './interfaces/IProduct';

@injectable()
export class ProductsApiProvider implements IProdutcsApiProvider {
	private readonly httpClient: AxiosInstance;

	constructor(
		@inject('ICircuitBreakerProvider')
		private readonly circuitBreaker: ICircuitBreakerProvider,
	) {
		this.httpClient = axios.create({
			baseURL: process?.env?.PRODUCTS_API_URL,
			timeout: +!process?.env?.DEFAULT_API_REQUESTS_TIMEOUT,
		});

		this.circuitBreaker.initialize(this.fetchData.bind(this));
	}

	private async fetchData(endpoint: string): Promise<any> {
		const response = await this.httpClient.get(endpoint);
		return response.data;
	}

	public async getById(id: number): Promise<IProduct> {
		try {
			return (await this.circuitBreaker.fire(`/products/${id}`)) as IProduct;
		} catch (error) {
			throw new Error(`External API request failed: ${error}`);
		}
	}
}
