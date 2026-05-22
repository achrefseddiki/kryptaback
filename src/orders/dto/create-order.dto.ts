import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderLineItemDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsNotEmpty() name: string;
  @IsNumber() @IsPositive() price: number;
  @IsNumber() @Min(1) qty: number;
  @IsString() @IsNotEmpty() img: string;
}

export class CreateOrderDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsNotEmpty() address: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() governorate: string;

  @IsOptional() @IsString() notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderLineItemDto)
  items: OrderLineItemDto[];

  @IsOptional() @IsString() paymentMethod?: string;
  @IsOptional() @IsString() userId?: string;
}
