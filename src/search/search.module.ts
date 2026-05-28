import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Product } from '../products/entities/product.entity';
import { KryptaBuild } from '../krypta-builds/entities/krypta-build.entity';
import { Offer } from '../offers/entities/offer.entity';
import { BlogPost } from '../blog-posts/entities/blog-post.entity';
import { Drop } from '../drops/entities/drop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, KryptaBuild, Offer, BlogPost, Drop])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
