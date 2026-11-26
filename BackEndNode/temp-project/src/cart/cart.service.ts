import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddCartItemDto } from './dto/add-cart-item.dto';

export interface CartItem {
  bookId: string | number;
  title?: string;
  quantity: number;
}

export interface CheckoutSummary {
  message: string;
  userId: string;
  totalBooks: number;
  items: CartItem[];
  checkedOutAt: string;
}

@Injectable()
export class CartService {
  private readonly maxBooksPerCart = 3;
  private readonly carts = new Map<string, CartItem[]>();

  getCart(userId: string): CartItem[] {
    return this.carts.get(userId) ?? [];
  }

  addItem(userId: string, item: AddCartItemDto): CartItem[] {
    const currentCart = this.getCart(userId);

    const alreadyInCart = currentCart.some(
      (entry) => String(entry.bookId) === String(item.bookId),
    );
    if (alreadyInCart) {
      throw new BadRequestException(
        'Você já adicionou este livro ao carrinho. É permitida apenas 1 cópia por pessoa.',
      );
    }

    if (currentCart.length >= this.maxBooksPerCart) {
      throw new BadRequestException(
        `Limite atingido: você só pode adicionar até ${this.maxBooksPerCart} livros por carrinho.`,
      );
    }

    const updatedCart: CartItem[] = [
      ...currentCart,
      {
        bookId: item.bookId,
        title: item.title,
        quantity: 1,
      },
    ];

    this.carts.set(userId, updatedCart);
    return updatedCart;
  }

  removeItem(userId: string, bookId: string): CartItem[] {
    const currentCart = this.getCart(userId);
    const filteredCart = currentCart.filter(
      (entry) => String(entry.bookId) !== String(bookId),
    );

    if (filteredCart.length === currentCart.length) {
      throw new NotFoundException(`Item ${bookId} não encontrado no carrinho.`);
    }

    this.carts.set(userId, filteredCart);
    return filteredCart;
  }

  clearCart(userId: string): { message: string; items: CartItem[] } {
    this.carts.set(userId, []);
    return {
      message: 'Carrinho limpo com sucesso.',
      items: [],
    };
  }

  checkout(userId: string): CheckoutSummary {
    const currentCart = this.getCart(userId);

    if (currentCart.length === 0) {
      throw new BadRequestException(
        'Não é possível finalizar o checkout com o carrinho vazio.',
      );
    }

    const checkedOutItems = [...currentCart];
    this.carts.set(userId, []);

    return {
      message: 'Checkout realizado com sucesso.',
      userId,
      totalBooks: checkedOutItems.length,
      items: checkedOutItems,
      checkedOutAt: new Date().toISOString(),
    };
  }
}