import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { FeaturedBuildsService } from './featured-builds.service';
import { CreateFeaturedBuildDto } from './dto/create-featured-build.dto';
import { UpdateFeaturedBuildDto } from './dto/update-featured-build.dto';

@Controller('featured-builds')
export class FeaturedBuildsController {
  constructor(private readonly service: FeaturedBuildsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateFeaturedBuildDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFeaturedBuildDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
