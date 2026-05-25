import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairRequest } from './entities/repair-request.entity';
import { RepairRequestsService } from './repair-requests.service';
import { RepairRequestsController } from './repair-requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RepairRequest])],
  controllers: [RepairRequestsController],
  providers: [RepairRequestsService],
})
export class RepairRequestsModule {}
