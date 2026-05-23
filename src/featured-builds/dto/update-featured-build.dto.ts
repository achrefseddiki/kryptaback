import { IsNumber, IsOptional } from 'class-validator';

export class UpdateFeaturedBuildDto {
  @IsOptional() @IsNumber() position?: number;
}
