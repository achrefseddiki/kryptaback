import { Controller, Post, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { RepairRequestsService } from './repair-requests.service';
import { CreateRepairRequestDto } from './dto/create-repair-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('repair-requests')
export class RepairRequestsController {
  constructor(private readonly service: RepairRequestsService) {}

  @Post()
  create(@Body() dto: CreateRepairRequestDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.service.updateStatus(id, status);
  }
}
