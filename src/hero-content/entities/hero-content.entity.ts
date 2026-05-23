import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('hero_content')
export class HeroContent {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @Column({ type: 'varchar', nullable: true, default: null })
  title1En: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  title1Fr: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  title2En: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  title2Fr: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  subtitleEn: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  subtitleFr: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  btn1LabelEn: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  btn1LabelFr: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  btn1Href: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  btn2LabelEn: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  btn2LabelFr: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  btn2Href: string | null;
}
