package com.acervo.backend.model;

import java.util.UUID;

import com.acervo.backend.dto.UsuarioRequestDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter 
@Setter 
@NoArgsConstructor 
@EqualsAndHashCode(of = "id" )
@Table(name = "usuarios")
public class Usuario {

    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
 
    @Enumerated(EnumType.STRING)
    private PerfilUsuario perfil;
    
    @Column (nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;


    @Column(nullable = false)
    private String senha;

    public Usuario (UsuarioRequestDTO dados){
        this.nome = dados.nome();
        this.email = dados.email();
        this.senha = dados.senha();
        this.perfil = dados.perfil() != null ? dados.perfil() : PerfilUsuario.USER;
        
    }
}
