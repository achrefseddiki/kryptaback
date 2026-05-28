import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { KryptaBuild } from '../krypta-builds/entities/krypta-build.entity';
import { Offer } from '../offers/entities/offer.entity';
import { BlogPost } from '../blog-posts/entities/blog-post.entity';
import { Drop } from '../drops/entities/drop.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(KryptaBuild) private readonly buildRepo: Repository<KryptaBuild>,
    @InjectRepository(Offer) private readonly offerRepo: Repository<Offer>,
    @InjectRepository(BlogPost) private readonly blogRepo: Repository<BlogPost>,
    @InjectRepository(Drop) private readonly dropRepo: Repository<Drop>,
  ) {}

  async search(q: string) {
    const like = `%${q}%`;

    const [products, builds, offers, blogPosts, drops] = await Promise.all([
      this.productRepo.find({
        where: [{ name: ILike(like) }, { brand: ILike(like) }],
        select: ['id', 'slug', 'name', 'brand', 'price', 'img', 'categorySlug'],
        take: 5,
        order: { createdAt: 'DESC' },
      }),
      this.buildRepo
        .createQueryBuilder('b')
        .where('b.name ILIKE :like OR b.tagline ILIKE :like', { like })
        .select(['b.id', 'b.name', 'b.tagline', 'b.price', 'b.img'])
        .orderBy('b.createdAt', 'DESC')
        .limit(4)
        .getMany(),
      this.offerRepo
        .createQueryBuilder('o')
        .where('o.title ILIKE :like', { like })
        .select(['o.id', 'o.slug', 'o.title', 'o.price', 'o.img'])
        .orderBy('o.createdAt', 'DESC')
        .limit(3)
        .getMany(),
      this.blogRepo
        .createQueryBuilder('b')
        .where('b.title ILIKE :like OR b.excerpt ILIKE :like', { like })
        .select(['b.slug', 'b.title', 'b.img', 'b.category'])
        .orderBy('b.createdAt', 'DESC')
        .limit(3)
        .getMany(),
      this.dropRepo.find({
        where: [{ title: ILike(like) }],
        select: ['id', 'title', 'img', 'status'],
        take: 3,
        order: { createdAt: 'DESC' },
      }),
    ]);

    return { products, builds, offers, blogPosts, drops };
  }
}
