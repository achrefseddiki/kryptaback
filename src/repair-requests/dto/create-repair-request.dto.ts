import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export const REPAIR_TYPES = [
  'Hardware Diagnostics',
  'PC Repair & Upgrade',
  'Data Recovery',
  'Cooling & Thermal',
  'Custom PC Assembly',
  'Peripheral Repair',
  'Other',
] as const;

export class CreateRepairRequestDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsIn(REPAIR_TYPES)
  type: string;

  @IsString()
  @MinLength(10)
  details: string;
}
