import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request, HttpCode } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class ReviewsController {
  constructor(private readonly service: ReviewsService) {}

  @Get('products/:productId/reviews')
  findByProduct(@Param('productId') productId: string) {
    return this.service.findByProduct(productId);
  }

  @Post('products/:productId/reviews')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
    @Request() req: any,
  ) {
    const author = `${req.user.firstName} ${req.user.lastName}`.trim();
    return this.service.create(productId, dto, author, req.user.id);
  }

  @Get('offers/:offerId/reviews')
  findByOffer(@Param('offerId') offerId: string) {
    return this.service.findByOffer(offerId);
  }

  @Post('offers/:offerId/reviews')
  @UseGuards(JwtAuthGuard)
  createForOffer(
    @Param('offerId') offerId: string,
    @Body() dto: CreateReviewDto,
    @Request() req: any,
  ) {
    const author = `${req.user.firstName} ${req.user.lastName}`.trim();
    return this.service.createForOffer(offerId, dto, author, req.user.id);
  }

  @Get('krypta-builds/:buildId/reviews')
  findByBuild(@Param('buildId') buildId: string) {
    return this.service.findByBuild(buildId);
  }

  @Post('krypta-builds/:buildId/reviews')
  @UseGuards(JwtAuthGuard)
  createForBuild(
    @Param('buildId') buildId: string,
    @Body() dto: CreateReviewDto,
    @Request() req: any,
  ) {
    const author = `${req.user.firstName} ${req.user.lastName}`.trim();
    return this.service.createForBuild(buildId, dto, author, req.user.id);
  }

  @Delete('reviews/:id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
