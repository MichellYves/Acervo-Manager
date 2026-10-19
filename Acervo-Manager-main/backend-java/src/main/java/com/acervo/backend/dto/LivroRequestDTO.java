package com.acervo.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LivroRequestDTO(
     @NotBlank(message = "O título é obrigatório")
    String titulo,

    @NotBlank(message = "O autor é obrigatório")
    String autor,
    
    @NotBlank(message = "Informe a editora do livro")
    String editora,
    
    @NotBlank(message = "Informe o ano de publicação do livro")
    Integer anoPublicacao,
    
    @NotBlank(message = "O ISBN é obrigatório")
    String isbn,
    
    @NotBlank(message = "Informe a categoria do livro")
    String categoria,

    @NotNull(message = "A disponibilidade é obrigatória")
    Boolean disponivel
) {
    
}
