import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SpecDto {
  @IsString() label: string;
  @IsString() value: string;
  @IsOptional() @IsString() icon?: string;
}

export class CreateKryptaBuildDto {
  @IsString()
  name: string;

  @IsOptional() @IsString()
  tagline?: string;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  badge?: string;

  @IsNumber() @Min(0)
  price: number;

  @IsOptional() @IsString()
  img?: string;

  @IsOptional() @IsArray() @IsString({ each: true })
  images?: string[];

  @IsArray() @ValidateNested({ each: true }) @Type(() => SpecDto)
  specs: SpecDto[];

  @IsOptional() @IsInt() @Min(0)
  fps1080?: number;

  @IsOptional() @IsInt() @Min(0)
  fps1440?: number;

  @IsOptional() @IsInt() @Min(0)
  fps4k?: number;

  @IsOptional() @IsArray() @IsString({ each: true })
  features?: string[];

  @IsOptional() @IsBoolean()
  inStock?: boolean;
}
