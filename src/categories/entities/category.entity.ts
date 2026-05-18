import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryColumn()
  slug: string;

  @Column()
  label: string;

  @Column({ nullable: true, type: 'varchar' })
  parentSlug: string | null;

  @Column({ nullable: true, type: 'varchar' })
  img: string | null;
}
