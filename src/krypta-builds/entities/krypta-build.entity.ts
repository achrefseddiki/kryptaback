import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('krypta_builds')
export class KryptaBuild {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  tagline: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  badge: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  description: string | null;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  img: string | null;

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @Column({ type: 'jsonb', default: '[]' })
  specs: { label: string; value: string }[];

  @Column({ type: 'int', nullable: true, default: null })
  fps1080: number | null;

  @Column({ type: 'int', nullable: true, default: null })
  fps1440: number | null;

  @Column({ type: 'int', nullable: true, default: null })
  fps4k: number | null;

  @Column({ type: 'text', array: true, default: '{}' })
  features: string[];

  @Column({ default: true })
  inStock: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
