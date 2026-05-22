import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Review } from '../../reviews/entities/review.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float', nullable: true, default: null })
  oldPrice: number | null;

  @Column()
  img: string;

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @Column({ type: 'varchar', nullable: true })
  badge: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  specs: string[];

  @Column({ default: true })
  inStock: boolean;

  @Column()
  categorySlug: string;

  @ManyToOne(() => Category, { eager: false })
  @JoinColumn({ name: 'categorySlug', referencedColumnName: 'slug' })
  category: Category;

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
