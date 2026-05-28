import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop) private readonly repo: Repository<Shop>,
  ) {}

  findAll() {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  async findOne(id: string) {
    const shop = await this.repo.findOne({ where: { id } });
    if (!shop) throw new NotFoundException(`Shop '${id}' not found`);
    return shop;
  }

  create(dto: CreateShopDto) {
    return this.repo.save(this.repo.create({
      ...dto,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      hours: dto.hours ?? null,
      img: dto.img ?? null,
    }));
  }

  async update(id: string, dto: UpdateShopDto) {
    const shop = await this.findOne(id);
    Object.assign(shop, dto);
    return this.repo.save(shop);
  }

  async remove(id: string) {
    const shop = await this.findOne(id);
    return this.repo.remove(shop);
  }
}
