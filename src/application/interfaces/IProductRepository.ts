import { Product } from '@domain/entities/Product';
import { Repository } from 'typeorm';

export interface IProductRepository extends Repository<Product> {}
