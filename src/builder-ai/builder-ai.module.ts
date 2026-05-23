import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { BuilderAiService } from './builder-ai.service';
import { BuilderAiController } from './builder-ai.controller';

@Module({
  imports: [ProductsModule],
  controllers: [BuilderAiController],
  providers: [BuilderAiService],
})
export class BuilderAiModule {}
