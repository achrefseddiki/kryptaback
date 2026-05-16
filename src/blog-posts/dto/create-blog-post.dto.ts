import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBlogPostDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  excerpt: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsString()
  @IsOptional()
  readTime?: string;
}
