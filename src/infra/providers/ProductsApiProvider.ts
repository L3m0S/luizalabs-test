import axios, { AxiosInstance } from 'axios';
import { inject, injectable } from 'tsyringe';
import { IProdutcsApiProvider } from '@application/interfaces/IProductsApiProvider';
import { ICircuitBreakerProvider } from '@application/interfaces/ICircuitBreakerProvider';

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
		console.log(`bateu na api de produtos externos`);
		const response = await this.httpClient.get(endpoint);
		return response.data;
	}

	/**
	 * Método público que retorna os dados de um endpoint da API externa.
	 * Implementa caching e utiliza o circuit breaker para maior resiliência.
	 *
	 * @param endpoint - O endpoint da API externa a ser consultado.
	 */
	public async getData(endpoint: string): Promise<any> {
		try {
			const data = await this.circuitBreaker.fire(endpoint);
			return data;
		} catch (error) {
			throw new Error(`External API request failed: ${error}`);
		}
	}
}
