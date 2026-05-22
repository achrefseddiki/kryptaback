import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export interface OrderLineItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  img: string;
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  governorate: string;

  @Column({ type: 'text', nullable: true, default: null })
  notes: string | null;

  @Column({ type: 'jsonb' })
  items: OrderLineItem[];

  @Column({ type: 'float' })
  subtotal: number;

  @Column({ type: 'float' })
  total: number;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: 'cod' })
  paymentMethod: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  userId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
