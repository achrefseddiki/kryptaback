import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { Offer } from '../offers/entities/offer.entity';
import { KryptaBuild } from '../krypta-builds/entities/krypta-build.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Offer)
    private readonly offerRepo: Repository<Offer>,
    @InjectRepository(KryptaBuild)
    private readonly buildRepo: Repository<KryptaBuild>,
  ) {}

  async findByProduct(productId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product '${productId}' not found`);
    return this.reviewRepo.find({ where: { productId }, order: { createdAt: 'DESC' } });
  }

  async findByOffer(offerId: string) {
    const offer = await this.offerRepo.findOne({ where: { id: offerId } });
    if (!offer) throw new NotFoundException(`Offer '${offerId}' not found`);
    return this.reviewRepo.find({ where: { offerId }, order: { createdAt: 'DESC' } });
  }

  async findByBuild(buildId: string) {
    const build = await this.buildRepo.findOne({ where: { id: buildId } });
    if (!build) throw new NotFoundException(`Build '${buildId}' not found`);
    return this.reviewRepo.find({ where: { buildId }, order: { createdAt: 'DESC' } });
  }

  async create(productId: string, dto: CreateReviewDto, author: string, userId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product '${productId}' not found`);
    const existing = await this.reviewRepo.findOne({ where: { productId, userId } });
    if (existing) throw new ConflictException('You have already reviewed this product.');
    return this.reviewRepo.save(this.reviewRepo.create({ ...dto, productId, author, userId }));
  }

  async createForOffer(offerId: string, dto: CreateReviewDto, author: string, userId: string) {
    const offer = await this.offerRepo.findOne({ where: { id: offerId } });
    if (!offer) throw new NotFoundException(`Offer '${offerId}' not found`);
    const existing = await this.reviewRepo.findOne({ where: { offerId, userId } });
    if (existing) throw new ConflictException('You have already reviewed this offer.');
    return this.reviewRepo.save(this.reviewRepo.create({ ...dto, offerId, author, userId }));
  }

  async createForBuild(buildId: string, dto: CreateReviewDto, author: string, userId: string) {
    const build = await this.buildRepo.findOne({ where: { id: buildId } });
    if (!build) throw new NotFoundException(`Build '${buildId}' not found`);
    const existing = await this.reviewRepo.findOne({ where: { buildId, userId } });
    if (existing) throw new ConflictException('You have already reviewed this build.');
    return this.reviewRepo.save(this.reviewRepo.create({ ...dto, buildId, author, userId }));
  }

  async remove(id: string) {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Review '${id}' not found`);
    return this.reviewRepo.remove(review);
  }
}
