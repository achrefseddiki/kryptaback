import { Controller, Post, Body } from '@nestjs/common';
import { BuilderAiService } from './builder-ai.service';
import { SuggestDto } from './dto/suggest.dto';

@Controller('builder')
export class BuilderAiController {
  constructor(private readonly service: BuilderAiService) {}

  @Post('suggest')
  suggest(@Body() dto: SuggestDto) {
    return this.service.suggest(dto);
  }
}
