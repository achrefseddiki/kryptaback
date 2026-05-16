import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BuildComponent } from '../entities/build.entity';

class BuildComponentDto implements BuildComponent {
  @IsString()
  slot: string;

  @IsString()
  label: string;

  @IsString()
  @IsOptional()
  selected: string | null;
}

export class CreateBuildDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BuildComponentDto)
  @IsOptional()
  components?: BuildComponentDto[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalPrice?: number;
}
