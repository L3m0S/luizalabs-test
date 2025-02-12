import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('integer', { name: 'external_product_id', nullable: false })
  externalProductId!: number;

  @Column('varchar', { nullable: false })
  title!: string;

  @Column('varchar', { nullable: false })
  image!: string;

  @Column('numeric', { nullable: false, precision: 10, scale: 2 })
  price!: number;

  @Column('varchar', { nullable: false })
  description!: string;

  @Column('numeric', { nullable: true, precision: 10, scale: 2 })
  rating?: number

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  lastUpdateDate?: Date;
}
