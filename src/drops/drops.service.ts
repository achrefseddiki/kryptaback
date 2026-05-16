import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drop, DropStatus } from './entities/drop.entity';
import { CreateDropDto } from './dto/create-drop.dto';
import { UpdateDropDto } from './dto/update-drop.dto';

@Injectable()
export class DropsService {
  constructor(
    @InjectRepository(Drop)
    private readonly repo: Repository<Drop>,
  ) {}

  findAll(status?: DropStatus) {
    if (status) {
      return this.repo.find({ where: { status }, order: { createdAt: 'DESC' } });
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const drop = await this.repo.findOne({ where: { id } });
    if (!drop) throw new NotFoundException(`Drop '${id}' not found`);
    return drop;
  }

  async create(dto: CreateDropDto) {
    const exists = await this.repo.findOne({ where: { id: dto.id } });
    if (exists) throw new ConflictException(`Drop '${dto.id}' already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateDropDto) {
    const drop = await this.findOne(id);
    Object.assign(drop, dto);
    return this.repo.save(drop);
  }

  async remove(id: string) {
    const drop = await this.findOne(id);
    return this.repo.remove(drop);
  }
}
