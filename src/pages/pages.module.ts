import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SitePage } from './entities/page.entity';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SitePage])],
  controllers: [PagesController],
  providers: [PagesService],
})
export class PagesModule {}
