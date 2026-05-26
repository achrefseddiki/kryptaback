import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { MailService } from '../mail/mail.service';
import { PromoCodesService } from '../promo-codes/promo-codes.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
    private readonly mailService: MailService,
    private readonly promoCodesService: PromoCodesService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const subtotal = dto.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    let discountAmount = 0;
    let promoCode: string | null = null;

    if (dto.promoCode) {
      try {
        const promo = await this.promoCodesService.validate(dto.promoCode, dto.userId);
        discountAmount = Math.round(subtotal * promo.discountPercent / 100 * 100) / 100;
        promoCode = promo.code;
      } catch {
        // invalid code — ignore discount, place order at full price
      }
    }

    const order = this.repo.create({
      ...dto,
      notes: dto.notes ?? null,
      subtotal,
      discountAmount,
      total: Math.max(0, subtotal - discountAmount),
      status: 'pending',
      paymentMethod: dto.paymentMethod ?? 'cod',
      userId: dto.userId ?? null,
      email: dto.email ?? null,
      promoCode,
    });
    const saved = await this.repo.save(order);

    if (promoCode && dto.userId) {
      await this.promoCodesService.markUsed(promoCode, dto.userId);
    }

    if (saved.email) {
      this.mailService.sendOrderConfirmation(saved.email, {
        id: saved.id,
        firstName: saved.firstName,
        lastName: saved.lastName,
        items: saved.items,
        subtotal: saved.subtotal,
        total: saved.total,
        address: saved.address,
        city: saved.city,
        governorate: saved.governorate,
        phone: saved.phone,
        createdAt: saved.createdAt,
      });
    }

    return saved;
  }

  async findByUser(userId: string) {
    return this.repo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.repo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order '${id}' not found`);
    return order;
  }

  async findAll({ status, page = 1, limit = 20 }: FindOrdersDto) {
    const qb = this.repo.createQueryBuilder('order');
    if (status) qb.andWhere('order.status = :status', { status });
    const [data, total] = await qb
      .orderBy('order.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    return this.repo.save(order);
  }
}
