import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me/wishlist')
  @UseGuards(JwtAuthGuard)
  getWishlist(@CurrentUser() user: { id: string }) {
    return this.usersService.getWishlist(user.id);
  }

  @Post('me/wishlist/:productId')
  @UseGuards(JwtAuthGuard)
  addToWishlist(@CurrentUser() user: { id: string }, @Param('productId') productId: string) {
    return this.usersService.addToWishlist(user.id, productId);
  }

  @Delete('me/wishlist/:productId')
  @UseGuards(JwtAuthGuard)
  removeFromWishlist(@CurrentUser() user: { id: string }, @Param('productId') productId: string) {
    return this.usersService.removeFromWishlist(user.id, productId);
  }

  @Get(':id/wishlist')
  getPublicWishlist(@Param('id') id: string) {
    return this.usersService.getPublicWishlist(id);
  }
}
