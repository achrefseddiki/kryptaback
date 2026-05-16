import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Build } from './entities/build.entity';
import { CreateBuildDto } from './dto/create-build.dto';
import { UpdateBuildDto } from './dto/update-build.dto';

@Injectable()
export class BuildsService {
  constructor(
    @InjectRepository(Build)
    private readonly repo: Repository<Build>,
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const build = await this.repo.findOne({ where: { id } });
    if (!build) throw new NotFoundException(`Build '${id}' not found`);
    return build;
  }

  create(dto: CreateBuildDto) {
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateBuildDto) {
    const build = await this.findOne(id);
    Object.assign(build, dto);
    return this.repo.save(build);
  }

  async remove(id: string) {
    const build = await this.findOne(id);
    return this.repo.remove(build);
  }
}
