import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeaturedBuild } from './entities/featured-build.entity';
import { FeaturedBuildsService } from './featured-builds.service';
import { FeaturedBuildsController } from './featured-builds.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FeaturedBuild])],
  controllers: [FeaturedBuildsController],
  providers: [FeaturedBuildsService],
})
export class FeaturedBuildsModule {}
