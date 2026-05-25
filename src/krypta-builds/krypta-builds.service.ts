import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KryptaBuild } from './entities/krypta-build.entity';
import { CreateKryptaBuildDto } from './dto/create-krypta-build.dto';
import { UpdateKryptaBuildDto } from './dto/update-krypta-build.dto';

@Injectable()
export class KryptaBuildsService {
  constructor(
    @InjectRepository(KryptaBuild)
    private readonly repo: Repository<KryptaBuild>,
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const build = await this.repo.findOne({ where: { id } });
    if (!build) throw new NotFoundException(`Build '${id}' not found`);
    return build;
  }

  create(dto: CreateKryptaBuildDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateKryptaBuildDto) {
    const build = await this.findOne(id);
    Object.assign(build, dto);
    return this.repo.save(build);
  }

  async remove(id: string) {
    const build = await this.findOne(id);
    return this.repo.remove(build);
  }
}
