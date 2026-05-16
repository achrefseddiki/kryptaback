import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface BuildComponent {
  slot: string;
  label: string;
  selected: string | null;
}

@Entity('builds')
export class Build {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'My Build' })
  name: string;

  @Column({ type: 'jsonb', default: [] })
  components: BuildComponent[];

  @Column({ type: 'float', default: 0 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
