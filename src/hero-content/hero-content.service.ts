import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroContent } from './entities/hero-content.entity';
import { UpdateHeroContentDto } from './dto/update-hero-content.dto';

@Injectable()
export class HeroContentService {
  constructor(
    @InjectRepository(HeroContent)
    private readonly repo: Repository<HeroContent>,
  ) {}

  async get(): Promise<HeroContent | null> {
    return this.repo.findOne({ where: { id: 1 } });
  }

  async update(dto: UpdateHeroContentDto): Promise<HeroContent> {
    const existing = await this.repo.findOne({ where: { id: 1 } });
    if (existing) {
      Object.assign(existing, dto);
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({ id: 1, ...dto }));
  }
}
