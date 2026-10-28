package com.acervo.backend.dto;

import com.acervo.backend.model.PerfilUsuario;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioRequestDTO(
    @NotBlank (message = "Nome obrigatório!")
    String nome,
    @NotBlank (message = "E-mail obrigatório!") 
    @Email (message = "Formato de e-mail inválido")
    String email,
    @NotBlank (message = "Senha obrigatória!")
    String senha,
    @NotNull(message = "O perfi do usario é obrigatório!")
    PerfilUsuario perfil
) {
}
