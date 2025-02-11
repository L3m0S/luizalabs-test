import { IProduct } from '@infra/providers/interfaces/IProduct';

export interface IProdutcsApiProvider {
	getData(endpoint: string): Promise<IProduct>;
}
