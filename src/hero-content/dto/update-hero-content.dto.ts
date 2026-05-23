import { IsString, IsOptional } from 'class-validator';

export class UpdateHeroContentDto {
  @IsOptional() @IsString() title1En?: string;
  @IsOptional() @IsString() title1Fr?: string;
  @IsOptional() @IsString() title2En?: string;
  @IsOptional() @IsString() title2Fr?: string;
  @IsOptional() @IsString() subtitleEn?: string;
  @IsOptional() @IsString() subtitleFr?: string;
  @IsOptional() @IsString() btn1LabelEn?: string;
  @IsOptional() @IsString() btn1LabelFr?: string;
  @IsOptional() @IsString() btn1Href?: string;
  @IsOptional() @IsString() btn2LabelEn?: string;
  @IsOptional() @IsString() btn2LabelFr?: string;
  @IsOptional() @IsString() btn2Href?: string;
}
