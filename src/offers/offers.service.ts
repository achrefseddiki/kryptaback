import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function uniqueSlug(base: string, repo: Repository<Offer>, excludeId?: string): Promise<string> {
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await repo.findOne({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly repo: Repository<Offer>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['products'], order: { createdAt: 'DESC' } });
  }

  findActive() {
    const now = new Date();
    return this.repo
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.products', 'product')
      .where('(offer.startDate IS NULL OR offer.startDate <= :now)', { now })
      .andWhere('(offer.endDate IS NULL OR offer.endDate >= :now)', { now })
      .orderBy('offer.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string) {
    const offer = await this.repo.findOne({ where: { id }, relations: ['products'] });
    if (!offer) throw new NotFoundException(`Offer '${id}' not found`);
    return offer;
  }

  async findBySlug(slug: string) {
    const offer = await this.repo
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.products', 'product')
      .where('offer.slug = :slug', { slug })
      .getOne();
    if (!offer) throw new NotFoundException(`Offer '${slug}' not found`);
    return offer;
  }

  async create(dto: CreateOfferDto) {
    const products = dto.productIds?.length
      ? await this.productRepo.findByIds(dto.productIds)
      : [];
    const slug = await uniqueSlug(dto.slug ? slugify(dto.slug) : slugify(dto.title), this.repo);
    const offer = this.repo.create({
      slug,
      title: dto.title,
      description: dto.description ?? null,
      price: dto.price,
      img: dto.img ?? null,
      images: dto.images ?? [],
      startDate: dto.startDate ? new Date(dto.startDate) : null,
      endDate: dto.endDate ? new Date(dto.endDate) : null,
      products,
    });
    return this.repo.save(offer);
  }

  async update(id: string, dto: UpdateOfferDto) {
    const offer = await this.findOne(id);
    if (dto.slug !== undefined) {
      offer.slug = await uniqueSlug(slugify(dto.slug), this.repo, id);
    } else if (dto.title !== undefined && dto.title !== offer.title) {
      offer.title = dto.title;
      offer.slug = await uniqueSlug(slugify(dto.title), this.repo, id);
    }
    if (dto.title !== undefined) offer.title = dto.title;
    if (dto.description !== undefined) offer.description = dto.description ?? null;
    if (dto.price !== undefined) offer.price = dto.price;
    if (dto.img !== undefined) offer.img = dto.img ?? null;
    if (dto.images !== undefined) offer.images = dto.images;
    if ('startDate' in dto) offer.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if ('endDate' in dto) offer.endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.productIds !== undefined) {
      offer.products = dto.productIds.length
        ? await this.productRepo.findByIds(dto.productIds)
        : [];
    }
    return this.repo.save(offer);
  }

  async remove(id: string) {
    const offer = await this.findOne(id);
    return this.repo.remove(offer);
  }
}
