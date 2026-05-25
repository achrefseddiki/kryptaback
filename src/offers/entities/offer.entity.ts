import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: true, default: null })
  slug: string | null;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true, default: null })
  description: string | null;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  img: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  startDate: Date | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  endDate: Date | null;

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @ManyToMany(() => Product, { eager: true })
  @JoinTable({ name: 'offer_products' })
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
