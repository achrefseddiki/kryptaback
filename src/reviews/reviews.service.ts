import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findByProduct(productId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product '${productId}' not found`);
    return this.reviewRepo.find({ where: { productId }, order: { createdAt: 'DESC' } });
  }

  async create(productId: string, dto: CreateReviewDto) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product '${productId}' not found`);
    return this.reviewRepo.save(this.reviewRepo.create({ ...dto, productId }));
  }

  async remove(id: string) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Review '${id}' not found`);
    return this.reviewRepo.remove(review);
  }
}
