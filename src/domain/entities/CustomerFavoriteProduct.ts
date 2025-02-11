import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from './Customer';
import { Product } from './Product';

@Entity({ name: 'customer_favorite_products' })
export class CustomerFavoriteProduct {
	@PrimaryGeneratedColumn()
	id?: number;

	@ManyToOne(() => Product)
	@JoinColumn({ name: 'product_id' })
	product!: Product;

	@ManyToOne(() => Customer, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'customer_id' })
	customer!: Customer;
}
