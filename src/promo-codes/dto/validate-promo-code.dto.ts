import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ValidatePromoCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
