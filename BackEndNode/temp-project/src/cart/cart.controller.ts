import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import type { CartItem, CheckoutSummary } from './cart.service';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private resolveUserId(queryUserId?: string, headerUserId?: string): string {
    return queryUserId || headerUserId || 'default-user';
  }

  @Get()
  getCart(
    @Query('userId') userId?: string,
    @Headers('x-user-id') headerUserId?: string,
  ): CartItem[] {
    return this.cartService.getCart(this.resolveUserId(userId, headerUserId));
  }

  @Post('items')
  addItem(
    @Body() item: AddCartItemDto,
    @Query('userId') userId?: string,
    @Headers('x-user-id') headerUserId?: string,
  ): CartItem[] {
    return this.cartService.addItem(
      this.resolveUserId(userId, headerUserId),
      item,
    );
  }

  @Post('checkout')
  checkout(
    @Query('userId') userId?: string,
    @Headers('x-user-id') headerUserId?: string,
  ): CheckoutSummary {
    return this.cartService.checkout(this.resolveUserId(userId, headerUserId));
  }

  @Delete('items/:bookId')
  removeItem(
    @Param('bookId') bookId: string,
    @Query('userId') userId?: string,
    @Headers('x-user-id') headerUserId?: string,
  ): CartItem[] {
    return this.cartService.removeItem(
      this.resolveUserId(userId, headerUserId),
      bookId,
    );
  }

  @Delete()
  clearCart(
    @Query('userId') userId?: string,
    @Headers('x-user-id') headerUserId?: string,
  ) {
    return this.cartService.clearCart(
      this.resolveUserId(userId, headerUserId),
    );
  }
}