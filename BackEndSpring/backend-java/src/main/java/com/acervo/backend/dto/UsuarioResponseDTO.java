package com.acervo.backend.dto;

import java.util.UUID;
import com.acervo.backend.model.Usuario;

public record UsuarioResponseDTO(
    UUID id,
    String email,
    String nome
    
) {
    public UsuarioResponseDTO(Usuario usuario) {
       this(usuario.getId(), usuario.getEmail(), usuario.getNome());
    }
}
