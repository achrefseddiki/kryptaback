import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFeaturedBuildDto {
  @IsString() productId: string;
  @IsOptional() @IsNumber() position?: number;
}
