package com.acervo.backend.dto;

import java.util.UUID;

import com.acervo.backend.model.Livro;

public record LivroResponseDTO(
        UUID id,
        String titulo,
        String autor,
        String editora,
        Integer anoPublicacao,
        String isbn,
        String categoria 
) {
public LivroResponseDTO(Livro livro) {
        this(livro.getId(),
         livro.getTitulo(),
         livro.getAutor(),
         livro.getEditora(),
         livro.getAnoPublicacao(),
         livro.getIsbn(),
         livro.getCategoria());
    }

}
