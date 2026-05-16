import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DropStatus {
  LIVE = 'live',
  SOLD_OUT = 'sold_out',
  UPCOMING = 'upcoming',
}

@Entity('drops')
export class Drop {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ default: 0 })
  available: number;

  @Column()
  total: number;

  @Column()
  img: string;

  @Column({ type: 'enum', enum: DropStatus, default: DropStatus.UPCOMING })
  status: DropStatus;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  endsAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
