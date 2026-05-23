import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SelectedComponentDto {
  @IsString() slot: string;
  @IsString() label: string;
  @IsString() productId: string;
  @IsString() productName: string;
  @IsNumber() price: number;
  @IsArray() @IsString({ each: true }) specs: string[];
}

export class SuggestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedComponentDto)
  selectedComponents: SelectedComponentDto[];

  @IsString() targetSlot: string;
  @IsString() targetLabel: string;

  @IsOptional() @IsNumber() @Min(0) budget?: number;
}
