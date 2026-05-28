import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { KryptaBuild } from '../../krypta-builds/entities/krypta-build.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  author: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  userId: string | null;

  @Column({ type: 'int' })
  rating: number;

  @Column('text')
  body: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  productId: string | null;

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'productId' })
  product: Product | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  offerId: string | null;

  @ManyToOne(() => Offer, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'offerId' })
  offer: Offer | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  buildId: string | null;

  @ManyToOne(() => KryptaBuild, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'buildId' })
  build: KryptaBuild | null;

  @CreateDateColumn()
  createdAt: Date;
}
