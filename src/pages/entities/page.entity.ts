import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('site_pages')
export class SitePage {
  @PrimaryColumn()
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text', default: '' })
  content: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
