import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SitePage } from './entities/page.entity';

@Injectable()
export class PagesService {
  constructor(@InjectRepository(SitePage) private repo: Repository<SitePage>) {}

  findAll() {
    return this.repo.find({ order: { slug: 'ASC' } });
  }

  async findBySlug(slug: string) {
    const page = await this.repo.findOneBy({ slug });
    if (!page) throw new NotFoundException(`Page "${slug}" not found`);
    return page;
  }

  async upsert(slug: string, dto: { title: string; content: string }) {
    const existing = await this.repo.findOneBy({ slug });
    if (existing) {
      await this.repo.update({ slug }, dto);
      return this.repo.findOneBy({ slug });
    }
    const page = this.repo.create({ slug, ...dto });
    return this.repo.save(page);
  }
}
