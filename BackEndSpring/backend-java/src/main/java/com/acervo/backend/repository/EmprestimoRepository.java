package com.acervo.backend.repository;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.acervo.backend.model.Emprestimo;
import com.acervo.backend.model.StatusEmprestimo;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, UUID> {
    List<Emprestimo> findByStatus(StatusEmprestimo status);

    List<Emprestimo> findByUsuarioId(UUID UsuarioID);
    
}
