package com.acervo.backend.model;

import java.io.Serializable;
import java.util.UUID;
import com.acervo.backend.dto.LivroRequestDTO;
import jakarta.persistence.*;
import lombok.*;

@Entity 
@Table(name = "livros")
@Getter 
@Setter 
@NoArgsConstructor 
@EqualsAndHashCode(of = "id") 
public class Livro implements Serializable {
    
    private static final long serialVersionUID = 1L;

    public Livro(LivroRequestDTO dados) {
        this.titulo = dados.titulo();
        this.autor = dados.autor();
        this.editora = dados.editora();
        this.anoPublicacao = dados.anoPublicacao();
        this.isbn = dados.isbn();
        this.categoria = dados.categoria();
        this.disponivel = dados.disponivel();
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, length = 100)
    private String autor;

    @Column(length = 100)
    private String editora;

    @Column(name = "ano_publicacao", nullable = false)
    private Integer anoPublicacao;

    @Column (length = 20)
    private String isbn;

    @Column (length = 50)
    private String categoria;

    @Column(nullable = false)
    private Boolean disponivel = true;
}
