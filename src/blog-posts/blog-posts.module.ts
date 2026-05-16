import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { BlogPostsService } from './blog-posts.service';
import { BlogPostsController } from './blog-posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost])],
  controllers: [BlogPostsController],
  providers: [BlogPostsService],
  exports: [BlogPostsService],
})
export class BlogPostsModule {}
