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

  async getStats(from?: string, to?: string) {
    const fromDate = from ? new Date(from + 'T00:00:00') : new Date(Date.now() - 30 * 86400000);
    const toDate = to ? new Date(to + 'T23:59:59') : new Date();

    const allOrders = await this.repo
      .createQueryBuilder('o')
      .where('o.createdAt >= :from', { from: fromDate })
      .andWhere('o.createdAt <= :to', { to: toDate })
      .getMany();

    const delivered = allOrders.filter(o => o.status === 'delivered');
    const pending = allOrders.filter(o => o.status === 'pending');
    const cancelled = allOrders.filter(o => o.status === 'cancelled');

    const totalRevenue = delivered.reduce((s, o) => s + o.total, 0);
    const avgOrderValue = delivered.length ? totalRevenue / delivered.length : 0;

    // Revenue per day — fill all days in range so chart has no gaps
    const dayMap = new Map<string, { revenue: number; orders: number }>();
    allOrders.forEach(o => {
      const day = new Date(o.createdAt).toISOString().slice(0, 10);
      if (!dayMap.has(day)) dayMap.set(day, { revenue: 0, orders: 0 });
      const d = dayMap.get(day)!;
      d.orders += 1;
      if (o.status === 'delivered') d.revenue += o.total;
    });
    const revenueByDay: { date: string; revenue: number; orders: number }[] = [];
    const cur = new Date(fromDate);
    while (cur <= toDate) {
      const dateStr = cur.toISOString().slice(0, 10);
      const v = dayMap.get(dateStr) ?? { revenue: 0, orders: 0 };
      revenueByDay.push({ date: dateStr, revenue: Math.round(v.revenue * 100) / 100, orders: v.orders });
      cur.setDate(cur.getDate() + 1);
    }

    // Order counts by status
    const statusMap = new Map<string, number>();
    allOrders.forEach(o => statusMap.set(o.status, (statusMap.get(o.status) ?? 0) + 1));
    const ordersByStatus = Array.from(statusMap.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count);

    // Top products (delivered only, by qty)
    const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
    delivered.forEach(o => {
      o.items.forEach(item => {
        if (!productMap.has(item.productId)) {
          productMap.set(item.productId, { name: item.name, qty: 0, revenue: 0 });
        }
        const p = productMap.get(item.productId)!;
        p.qty += item.qty;
        p.revenue = Math.round((p.revenue + item.price * item.qty) * 100) / 100;
      });
    });
    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 6);

    // Revenue by governorate (delivered only)
    const govMap = new Map<string, { revenue: number; orders: number }>();
    delivered.forEach(o => {
      const gov = o.governorate || 'Unknown';
      if (!govMap.has(gov)) govMap.set(gov, { revenue: 0, orders: 0 });
      const g = govMap.get(gov)!;
      g.revenue += o.total;
      g.orders += 1;
    });
    const revenueByGovernorate = Array.from(govMap.entries())
      .map(([governorate, v]) => ({ governorate, revenue: Math.round(v.revenue * 100) / 100, orders: v.orders }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: allOrders.length,
      deliveredOrders: delivered.length,
      pendingOrders: pending.length,
      cancelledOrders: cancelled.length,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      revenueByDay,
      ordersByStatus,
      topProducts,
      revenueByGovernorate,
    };
  }
}
