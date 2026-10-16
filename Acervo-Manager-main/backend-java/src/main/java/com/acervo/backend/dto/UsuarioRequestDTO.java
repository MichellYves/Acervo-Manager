package com.acervo.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UsuarioRequestDTO(
    @NotBlank (message = "Nome obrigatório!")
    String nome,
    @NotBlank (message = "E-mail obrigatório!") 
    @Email (message = "Formato de e-mail inválido")
    String email,
    @NotBlank (message = "Senha obrigatória!")
    String senha
) {
    
}
