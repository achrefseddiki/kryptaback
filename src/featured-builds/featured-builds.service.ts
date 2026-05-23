import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeaturedBuild } from './entities/featured-build.entity';
import { CreateFeaturedBuildDto } from './dto/create-featured-build.dto';
import { UpdateFeaturedBuildDto } from './dto/update-featured-build.dto';

@Injectable()
export class FeaturedBuildsService {
  constructor(
    @InjectRepository(FeaturedBuild)
    private readonly repo: Repository<FeaturedBuild>,
  ) {}

  findAll() {
    return this.repo.find({ order: { position: 'ASC', createdAt: 'ASC' } });
  }

  async create(dto: CreateFeaturedBuildDto) {
    const exists = await this.repo.findOne({ where: { productId: dto.productId } });
    if (exists) throw new ConflictException('This product is already in the featured builds section');

    if (dto.position == null) {
      dto.position = await this.repo.count();
    }
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateFeaturedBuildDto) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Featured build '${id}' not found`);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Featured build '${id}' not found`);
    return this.repo.remove(item);
  }
}
