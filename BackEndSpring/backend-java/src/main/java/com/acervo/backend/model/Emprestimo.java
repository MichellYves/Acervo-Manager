package com.acervo.backend.model;

import java.time.LocalDate;
import java.util.UUID;
import org.hibernate.annotations.UuidGenerator;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity 
@Table(name = "emprestimos")
@Getter 
@Setter 
@NoArgsConstructor 
@AllArgsConstructor 
public class Emprestimo {

    @Id 
    @GeneratedValue 
    @UuidGenerator 
    private UUID id;

    @ManyToOne 
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne 
    @JoinColumn(name = "livroId", nullable = false)
    private Livro livro;

    @Column(nullable = false)
    private LocalDate dataEmprestimo;
    
    @Column(nullable = false)
    private LocalDate devolucaoPrevista;

    @Column(nullable = false)
    private LocalDate devolucaoReal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEmprestimo status;

}
