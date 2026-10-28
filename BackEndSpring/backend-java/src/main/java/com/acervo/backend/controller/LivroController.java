package com.acervo.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.acervo.backend.dto.LivroRequestDTO;
import com.acervo.backend.dto.LivroResponseDTO;
import com.acervo.backend.service.LivroService;

import jakarta.validation.Valid;

@RestController 
@RequestMapping("/livros")
public class LivroController {
    
    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }
    @PostMapping 
    public ResponseEntity<LivroResponseDTO> salvarLivro(@RequestBody @Valid  LivroRequestDTO dados) {
        LivroResponseDTO livroCriado = livroService.salvarLivro(dados);
        return ResponseEntity.ok(livroCriado);
    }
    @GetMapping 
    public ResponseEntity<List<LivroResponseDTO>> listarLivros() {
        List<LivroResponseDTO> livros = livroService.listarLivros();
        return ResponseEntity.ok(livros);
    }
    @GetMapping("{id}")
    public ResponseEntity<LivroResponseDTO> buscarPorId(@PathVariable UUID id) {
        LivroResponseDTO livro = livroService.buscarPorId(id);
        return ResponseEntity.ok(livro);
    }
    @GetMapping("/titulo")
    public ResponseEntity<List<LivroResponseDTO>> buscarPorTitulo(@PathVariable String titulo) {
        List<LivroResponseDTO> livros = livroService.buscarPorTitulo(titulo);
        return ResponseEntity.ok(livros);
    }
    @PutMapping("/{id}")
    public ResponseEntity<LivroResponseDTO> atualizarLivro(@PathVariable UUID id, @RequestBody @Valid LivroRequestDTO dados){
        LivroResponseDTO livroAtualizado = livroService.salvarLivro(dados);
        return ResponseEntity.ok(livroAtualizado);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLivro(@PathVariable UUID id) {
        livroService.deletarLivro(id);
        return ResponseEntity.noContent().build();
    }
}
