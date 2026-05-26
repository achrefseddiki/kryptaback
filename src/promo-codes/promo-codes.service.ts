import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromoCode } from './entities/promo-code.entity';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectRepository(PromoCode)
    private readonly repo: Repository<PromoCode>,
  ) {}

  async create(dto: CreatePromoCodeDto): Promise<PromoCode> {
    const existing = await this.repo.findOne({ where: { code: dto.code.toUpperCase() } });
    if (existing) throw new BadRequestException(`Code '${dto.code}' already exists`);
    const promo = this.repo.create({
      code: dto.code.toUpperCase(),
      discountPercent: dto.discountPercent,
      active: dto.active ?? true,
      usedByUserIds: [],
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
    });
    return this.repo.save(promo);
  }

  findAll(): Promise<PromoCode[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async toggle(id: string): Promise<PromoCode> {
    const promo = await this.repo.findOne({ where: { id } });
    if (!promo) throw new NotFoundException('Promo code not found');
    promo.active = !promo.active;
    return this.repo.save(promo);
  }

  async remove(id: string): Promise<void> {
    const promo = await this.repo.findOne({ where: { id } });
    if (!promo) throw new NotFoundException('Promo code not found');
    await this.repo.remove(promo);
  }

  async validate(code: string, userId?: string): Promise<{ code: string; discountPercent: number }> {
    const promo = await this.repo.findOne({ where: { code: code.toUpperCase() } });
    if (!promo) throw new NotFoundException('Invalid promo code');
    if (!promo.active) throw new BadRequestException('This promo code is no longer active');
    if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) {
      throw new BadRequestException('This promo code has expired');
    }
    if (userId && promo.usedByUserIds.includes(userId)) {
      throw new BadRequestException('You have already used this promo code');
    }
    return { code: promo.code, discountPercent: promo.discountPercent };
  }

  async markUsed(code: string, userId: string): Promise<void> {
    const promo = await this.repo.findOne({ where: { code: code.toUpperCase() } });
    if (!promo || !userId) return;
    if (!promo.usedByUserIds.includes(userId)) {
      promo.usedByUserIds = [...promo.usedByUserIds, userId];
      await this.repo.save(promo);
    }
  }
}
