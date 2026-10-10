package com.acervo.backend.dto;

import java.util.UUID;
import com.acervo.backend.model.Usuario;

public record UsuarioResponseDTO(
    UUID id,
    String email
) {
    public UsuarioResponseDTO(Usuario usuario) {
       this(usuario.getId(), usuario.getEmail());
    }
}
