package com.acervo.backend.controller;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.acervo.backend.dto.EmprestimoRequestDTO;
import com.acervo.backend.dto.EmprestimoResponseDTO;
import com.acervo.backend.model.Emprestimo;
import com.acervo.backend.service.EmprestimoService;

@RestController 
@RequestMapping("/emprestimos")
public class EmprestimoController {
    private final EmprestimoService emprestimoService;
    
    public EmprestimoController(EmprestimoService emprestimoService){
        this.emprestimoService = emprestimoService;
    }
    @GetMapping 
    public ResponseEntity<List<EmprestimoResponseDTO>> listarTodos() {
        List<EmprestimoResponseDTO> emprestimos = emprestimoService.listarTodos()
                        .stream()
                        .map(EmprestimoResponseDTO::new)
                        .toList();
            return ResponseEntity.ok(emprestimos);
    }
    @PostMapping 
    public ResponseEntity<EmprestimoResponseDTO> realizarEmprestimo(@RequestBody EmprestimoRequestDTO dados){  
        Emprestimo novoEmprestimo = emprestimoService.realizarEmprestimo(dados.usuarioId(), dados.livroId());
        return ResponseEntity.status(HttpStatus.CREATED).body(new EmprestimoResponseDTO(novoEmprestimo));
    }
    @PutMapping("/{id}/devolucao")
    public ResponseEntity<EmprestimoResponseDTO> devolverLivro(@PathVariable UUID id){
        Emprestimo emprestimoAtualizado = emprestimoService.realizarDevolucao(id);
        return ResponseEntity.ok(new EmprestimoResponseDTO(emprestimoAtualizado));
    }
}
