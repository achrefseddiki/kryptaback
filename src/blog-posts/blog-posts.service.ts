import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogPostsService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly repo: Repository<BlogPost>,
  ) {}

  findAll(category?: string) {
    if (category) {
      return this.repo.find({ where: { category }, order: { createdAt: 'DESC' } });
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(slug: string) {
    const post = await this.repo.findOne({ where: { slug } });
    if (!post) throw new NotFoundException(`Blog post '${slug}' not found`);
    return post;
  }

  async create(dto: CreateBlogPostDto) {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException(`Blog post '${dto.slug}' already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(slug: string, dto: UpdateBlogPostDto) {
    const post = await this.findOne(slug);
    Object.assign(post, dto);
    return this.repo.save(post);
  }

  async remove(slug: string) {
    const post = await this.findOne(slug);
    return this.repo.remove(post);
  }
}
