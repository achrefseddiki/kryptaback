import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  findAll(categorySlug?: string) {
    if (categorySlug) {
      return this.repo.find({ where: { categorySlug } });
    }
    return this.repo.find();
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
