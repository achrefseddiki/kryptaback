import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll({ category, search, brand, minPrice, maxPrice, page = 1, limit = 20 }: FindProductsDto) {
    const qb = this.repo.createQueryBuilder('product');

    if (category) {
      const children = await this.categoryRepo.find({ where: { parentSlug: category } });
      const slugs = [category, ...children.map((c) => c.slug)];
      qb.andWhere('product.categorySlug IN (:...slugs)', { slugs });
    }

    if (search) {
      qb.andWhere(
        '(product.name ILIKE :search OR product.brand ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (brand) {
      const brands = brand.split(',').map((b) => b.trim()).filter(Boolean);
      if (brands.length === 1) {
        qb.andWhere('product.brand = :brand', { brand: brands[0] });
      } else if (brands.length > 1) {
        qb.andWhere('product.brand IN (:...brands)', { brands });
      }
    }

    if (minPrice !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const [data, total] = await qb
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const product = await this.repo.findOne({ where: { id }, relations: ['reviews'] });
    if (!product) throw new NotFoundException(`Product '${id}' not found`);
    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.repo.findOne({ where: { slug }, relations: ['reviews'] });
    if (!product) throw new NotFoundException(`Product with slug '${slug}' not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException(`Product with slug '${dto.slug}' already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.repo.remove(product);
  }
}
