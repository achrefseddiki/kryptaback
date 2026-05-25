import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepairRequest } from './entities/repair-request.entity';
import { CreateRepairRequestDto } from './dto/create-repair-request.dto';

@Injectable()
export class RepairRequestsService {
  constructor(
    @InjectRepository(RepairRequest)
    private readonly repo: Repository<RepairRequest>,
  ) {}

  create(dto: CreateRepairRequestDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: string, status: string) {
    const req = await this.repo.findOne({ where: { id } });
    if (!req) throw new NotFoundException(`RepairRequest '${id}' not found`);
    req.status = status;
    return this.repo.save(req);
  }
}
