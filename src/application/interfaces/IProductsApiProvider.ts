import { IProduct } from '@infra/providers/interfaces/IProduct';

export interface IProdutcsApiProvider {
	getById(id: number): Promise<IProduct>;
}
