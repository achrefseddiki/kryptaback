import { IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';
import { DropStatus } from '../entities/drop.entity';

export class CreateDropDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  available: number;

  @IsNumber()
  @Min(1)
  total: number;

  @IsString()
  @IsNotEmpty()
  img: string;

  @IsEnum(DropStatus)
  @IsOptional()
  status?: DropStatus;

  @IsDateString()
  @IsOptional()
  endsAt?: string | null;
}
