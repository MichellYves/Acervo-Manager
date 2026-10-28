package com.acervo.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.acervo.backend.dto.LivroRequestDTO;
import com.acervo.backend.dto.LivroResponseDTO;
import com.acervo.backend.model.Livro;
import com.acervo.backend.repository.LivroRepository;
import org.springframework.transaction.annotation.Transactional;

@Service 
public class LivroService {
    
    private final LivroRepository livroRepository;

    public LivroService(LivroRepository livroRepository) {
        this.livroRepository = livroRepository;
    }   

@Transactional 
public LivroResponseDTO salvarLivro(LivroRequestDTO dados) {
    Livro livro = new Livro(dados);
    Livro livroNovo = livroRepository.save(livro);
    return new LivroResponseDTO(livroNovo);
}
@Transactional(readOnly = true)
public List<LivroResponseDTO> listarLivros() {
    return livroRepository.findAll().stream()
            .map(LivroResponseDTO::new)
            .collect(Collectors.toList());
}
@Transactional(readOnly = true)
public LivroResponseDTO buscarPorId(UUID id) {
    Livro livro = livroRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));
        return new LivroResponseDTO(livro);
}
@Transactional(readOnly = true)
public List<LivroResponseDTO> buscarPorTitulo(String titulo) {
    return livroRepository.findByTituloContainingIgnoreCase(titulo)
            .stream().map(LivroResponseDTO::new)
            .collect(Collectors.toList());
}
@Transactional 
public LivroResponseDTO atualizarLivro(UUID id, LivroRequestDTO dados) {
    Livro livro = livroRepository.findById(id)
           .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));
        
           livro.setTitulo(dados.titulo());
           livro.setAutor(dados.autor());

    Livro livroAtualizado = livroRepository.save(livro);
    return new LivroResponseDTO(livroAtualizado);           
}
@Transactional 
public void deletarLivro(UUID id) {
    Livro livro = livroRepository.findById(id)
          .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));

    livroRepository.delete(livro);
}

}