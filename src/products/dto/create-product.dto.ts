import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  oldPrice?: number | null;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  badge?: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specs?: string[];

  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsString()
  @IsNotEmpty()
  categorySlug: string;
}
