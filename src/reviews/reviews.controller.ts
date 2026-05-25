import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller()
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Get('products/:productId/reviews')
  findByProduct(@Param('productId') productId: string) {
    return this.service.findByProduct(productId);
  }

  @Post('products/:productId/reviews')
  create(@Param('productId') productId: string, @Body() dto: CreateReviewDto) {
    return this.service.create(productId, dto);
  }

  @Get('offers/:offerId/reviews')
  findByOffer(@Param('offerId') offerId: string) {
    return this.service.findByOffer(offerId);
  }

  @Post('offers/:offerId/reviews')
  createForOffer(@Param('offerId') offerId: string, @Body() dto: CreateReviewDto) {
    return this.service.createForOffer(offerId, dto);
  }

  @Delete('reviews/:id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
