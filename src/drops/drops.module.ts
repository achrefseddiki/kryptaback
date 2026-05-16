import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drop } from './entities/drop.entity';
import { DropsService } from './drops.service';
import { DropsController } from './drops.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Drop])],
  controllers: [DropsController],
  providers: [DropsService],
  exports: [DropsService],
})
export class DropsModule {}
