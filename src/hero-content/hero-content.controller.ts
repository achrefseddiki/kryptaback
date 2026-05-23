import { Controller, Get, Patch, Body } from '@nestjs/common';
import { HeroContentService } from './hero-content.service';
import { UpdateHeroContentDto } from './dto/update-hero-content.dto';

@Controller('hero-content')
export class HeroContentController {
  constructor(private readonly service: HeroContentService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Patch()
  update(@Body() dto: UpdateHeroContentDto) {
    return this.service.update(dto);
  }
}
