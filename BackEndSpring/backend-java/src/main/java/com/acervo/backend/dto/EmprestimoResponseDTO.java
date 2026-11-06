package com.acervo.backend.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.acervo.backend.model.Emprestimo;
import com.acervo.backend.model.StatusEmprestimo;

public record EmprestimoResponseDTO(
    UUID id,
    UUID usuarioID,
    String usuarioNome,
    UUID livroID,
    String livroTitulo,
    LocalDate dataEmprestimo,
    LocalDate devolucaoPrevista,
    LocalDate devolucaoReal,
    StatusEmprestimo status

) {

    public EmprestimoResponseDTO(Emprestimo emprestimo) {
        this(
            emprestimo.getId(),
            emprestimo.getUsuario().getId(),
            emprestimo.getUsuario().getNome(),
            emprestimo.getLivro().getId(),
            emprestimo.getLivro().getTitulo(),
            emprestimo.getDataEmprestimo(),
            emprestimo.getDevolucaoPrevista(),
            emprestimo.getDevolucaoReal(),
            emprestimo.getStatus()
            );
    }
    
}
