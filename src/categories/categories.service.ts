import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findRoots() {
    return this.repo.find({ where: { parentSlug: null as any } });
  }

  findChildren(parentSlug: string) {
    return this.repo.find({ where: { parentSlug } });
  }

  async findOne(slug: string) {
    const category = await this.repo.findOne({ where: { slug } });
    if (!category) throw new NotFoundException(`Category '${slug}' not found`);
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException(`Category '${dto.slug}' already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(slug: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(slug);
    Object.assign(category, dto);
    return this.repo.save(category);
  }

  async remove(slug: string) {
    const category = await this.findOne(slug);
    return this.repo.remove(category);
  }
}
