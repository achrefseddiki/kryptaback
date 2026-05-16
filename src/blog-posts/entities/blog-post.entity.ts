import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blog_posts')
export class BlogPost {
  @PrimaryColumn()
  slug: string;

  @Column()
  title: string;

  @Column('text')
  excerpt: string;

  @Column({ type: 'text', nullable: true, default: null })
  content: string | null;

  @Column()
  category: string;

  @Column()
  img: string;

  @Column({ default: '5 min read' })
  readTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
