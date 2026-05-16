import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { DropsService } from './drops.service';
import { CreateDropDto } from './dto/create-drop.dto';
import { UpdateDropDto } from './dto/update-drop.dto';
import { DropStatus } from './entities/drop.entity';

@Controller('drops')
export class DropsController {
  constructor(private readonly service: DropsService) {}

  @Get()
  findAll(@Query('status') status?: DropStatus) {
    return this.service.findAll(status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDropDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDropDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
