import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('promo_codes')
export class PromoCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'float' })
  discountPercent: number;

  @Column({ default: true })
  active: boolean;

  @Column('varchar', { array: true, default: '{}' })
  usedByUserIds: string[];

  @Column({ type: 'timestamptz', nullable: true, default: null })
  expiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}
