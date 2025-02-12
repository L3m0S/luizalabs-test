import 'reflect-metadata';
import { container } from 'tsyringe';
import { IProdutcsApiProvider } from '@application/interfaces/IProductsApiProvider';
import { IProductService } from '@application/interfaces/IProductService';
import { ProductService } from '@application/services/ProductService';
import { ProductsApiProvider } from '@infra/providers/ProductsApiProvider';
import { ICustomerService } from '@application/interfaces/ICustomerService';
import { CustomerService } from '@application/services/CustomerService';
import { ICustomerFavoriteProductService } from '@application/interfaces/ICustomerFavoriteProductsService';
import { CustomerFavoriteProductService } from '@application/services/CustomerFavoriteProductsService';
import { ICircuitBreakerProvider } from '@application/interfaces/ICircuitBreakerProvider';
import { OpossumCircuitBreakerProvider } from '@infra/providers/OpossumCircuitBreakerProvider';

container.register<IProductService>('IProductService', {
	useClass: ProductService,
});

container.register<IProdutcsApiProvider>('IProdutcsApiProvider', {
	useClass: ProductsApiProvider,
});

container.register<ICustomerService>('ICustomerService', {
	useClass: CustomerService,
});

container.register<ICustomerFavoriteProductService>('ICustomerFavoriteProductService', {
	useClass: CustomerFavoriteProductService,
});

container.register<ICircuitBreakerProvider>('ICircuitBreakerProvider', {
	useClass: OpossumCircuitBreakerProvider,
});
