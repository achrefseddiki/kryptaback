import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryColumn()
  slug: string;

  @Column()
  label: string;
}
