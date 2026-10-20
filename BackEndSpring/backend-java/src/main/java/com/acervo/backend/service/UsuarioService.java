package com.acervo.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.acervo.backend.dto.LoginRequestDTO;
import com.acervo.backend.dto.UsuarioRequestDTO;
import com.acervo.backend.dto.UsuarioResponseDTO;
import com.acervo.backend.model.Usuario;
import com.acervo.backend.repository.UsuarioRepository;
import jakarta.transaction.Transactional;


@Service 
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    //Listar usuários
    public List<UsuarioResponseDTO> listarUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();

        return  usuarios.stream()
        .map(UsuarioResponseDTO::new)
        .collect(Collectors.toList());
    }
    //Buscar usuário por ID
    public UsuarioResponseDTO buscarUsuarioPorId(UUID id) {
    return usuarioRepository.findById(id)
            .map(UsuarioResponseDTO::new).orElseThrow(() -> new RuntimeException("Não existe usuário com o id informado!"));
    }
    //Salvar usuário
    @Transactional 
    public UsuarioResponseDTO salvar(UsuarioRequestDTO requestDTO) {
        boolean emailExistente = usuarioRepository.findAll().stream()
        .anyMatch(u -> u.getEmail().equalsIgnoreCase(requestDTO.email()));
        if (emailExistente) {
            throw new IllegalArgumentException("E-mail já cadastrado!");
        }
        Usuario usuario = new Usuario();
        usuario.setNome(requestDTO.nome());
        usuario.setEmail(requestDTO.email());
        usuario.setSenha(requestDTO.senha());

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return new UsuarioResponseDTO(usuarioSalvo);
    }
    //Deletar usuário
    @Transactional
    public void deletarUsuario(UUID id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado!");
        }
        usuarioRepository.deleteById(id);
    } 

    //Antenticação de usuário
    @Transactional
    public UsuarioResponseDTO autenticarUsuario(LoginRequestDTO request) {
        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("E-mail não encontrado ou Credenciais inválidas!"));
        
                if (!usuario.getSenha().equals(request.senha())) {
                    throw new RuntimeException("Senha incorreta!");
                }
        return new UsuarioResponseDTO(usuario);
    }
}