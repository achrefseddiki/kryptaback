import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroContent } from './entities/hero-content.entity';
import { HeroContentService } from './hero-content.service';
import { HeroContentController } from './hero-content.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HeroContent])],
  controllers: [HeroContentController],
  providers: [HeroContentService],
})
export class HeroContentModule {}
