import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Get()
  search(@Query('q') q: string) {
    if (!q || q.trim().length < 2) return { products: [], builds: [], offers: [], blogPosts: [], drops: [] };
    return this.service.search(q.trim());
  }
}
