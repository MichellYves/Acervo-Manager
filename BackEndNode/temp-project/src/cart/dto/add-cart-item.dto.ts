import { IsInt, IsNotEmpty, IsPositive, IsString, Max, Min } from 'class-validator';

export class AddCartItemDto {
  @IsInt({ message: 'O bookId deve ser um número inteiro.' })
  @IsPositive({ message: 'O bookId deve ser maior que zero.' })
  @IsNotEmpty({ message: 'O bookId é obrigatório.' })
  bookId: number;

  @IsString({ message: 'O title deve ser um texto.' })
  @IsNotEmpty({ message: 'O title é obrigatório.' })
  title: string;

  @IsInt({ message: 'A quantity deve ser um número inteiro.' })
  @Min(1, { message: 'A quantity deve ser no mínimo 1.' })
  @Max(1, { message: 'É permitida apenas 1 cópia por livro por usuário.' })
  @IsNotEmpty({ message: 'A quantity é obrigatória.' })
  quantity: number;
}
