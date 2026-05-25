import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KryptaBuild } from './entities/krypta-build.entity';
import { KryptaBuildsService } from './krypta-builds.service';
import { KryptaBuildsController } from './krypta-builds.controller';

@Module({
  imports: [TypeOrmModule.forFeature([KryptaBuild])],
  controllers: [KryptaBuildsController],
  providers: [KryptaBuildsService],
})
export class KryptaBuildsModule {}
