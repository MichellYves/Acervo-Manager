package com.acervo.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.acervo.backend.model.Emprestimo;
import com.acervo.backend.model.Livro;
import com.acervo.backend.model.StatusEmprestimo;
import com.acervo.backend.model.Usuario;
import com.acervo.backend.repository.EmprestimoRepository;
import com.acervo.backend.repository.LivroRepository;
import com.acervo.backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service 
public class EmprestimoService {
    private final EmprestimoRepository emprestimoRepository;
    private final LivroRepository livroRepository;
    private final UsuarioRepository usuarioRepository;

    public EmprestimoService(EmprestimoRepository emprestimoRepository, LivroRepository livroRepository,
            UsuarioRepository usuarioRepository) {
        this.emprestimoRepository = emprestimoRepository;
        this.livroRepository = livroRepository;
        this.usuarioRepository = usuarioRepository;
    }
    public List<Emprestimo> listarTodos() {
        return emprestimoRepository.findAll();
    }    
    @Transactional 
    public Emprestimo realizarEmprestimo(UUID usuarioId, UUID livroId){
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(()-> new RuntimeException("Utilizador não encontrado!"));
                
        Livro livro = livroRepository.findById(livroId)
                 .orElseThrow(() -> new RuntimeException("Livro não encontrado!"));

        if (!livro.getDisponivel()) {
            throw new RuntimeException("Livro indisponível para empréstimo!");
        }
        livro.setDisponivel(false);
        livroRepository.save(livro);


        Emprestimo emprestimo = new Emprestimo();
        emprestimo.setUsuario(usuario);
        emprestimo.setLivro(livro);
        emprestimo.setDataEmprestimo(LocalDate.now());
        emprestimo.setDevolucaoPrevista(LocalDate.now().plusDays(14));
        emprestimo.setStatus(StatusEmprestimo.ATIVO);
        
        return emprestimoRepository.save(emprestimo);
    }
    @Transactional 
    public Emprestimo realizarDevolucao(UUID emprestimoId){
        Emprestimo emprestimo = emprestimoRepository.findById(emprestimoId)
                   .orElseThrow(() -> new RuntimeException("Empréstimo não encontrado!"));
        
        if (emprestimo.getStatus() == StatusEmprestimo.DEVOLVIDO) {
            String mensagemErro = "Este empréstimo já foi realizado anteriomente";
            throw new RuntimeException(mensagemErro);
        }
        emprestimo.setDevolucaoReal(LocalDate.now());
        emprestimo.setStatus(StatusEmprestimo.DEVOLVIDO);

        return emprestimoRepository.save(emprestimo);
    }

}
