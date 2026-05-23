import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const subtotal = dto.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = this.repo.create({
      ...dto,
      notes: dto.notes ?? null,
      subtotal,
      total: subtotal,
      status: 'pending',
      paymentMethod: dto.paymentMethod ?? 'cod',
      userId: dto.userId ?? null,
      email: dto.email ?? null,
    });
    const saved = await this.repo.save(order);

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
