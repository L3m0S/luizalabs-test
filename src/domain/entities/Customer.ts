import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'customers' })
export class Customer {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ type: 'varchar', length: 255, nullable: false })
	name?: string;

	@Column({ type: 'varchar', length: 255, nullable: false, unique: true })
	email?: string;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	updated_at?: Date;
}
