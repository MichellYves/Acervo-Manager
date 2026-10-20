package com.acervo.backend.controller; 

import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.acervo.backend.dto.LoginRequestDTO;
import com.acervo.backend.dto.UsuarioRequestDTO;
import com.acervo.backend.dto.UsuarioResponseDTO;
import com.acervo.backend.service.UsuarioService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {
    @Autowired                                                                      
    private UsuarioService usuarioService;  
    
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        List<UsuarioResponseDTO> usuarios = usuarioService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }
    @GetMapping("/{id}")
    public ResponseEntity <Object> buscarUsuarioPorId(@PathVariable UUID id) {
        try {
            UsuarioResponseDTO usuario = usuarioService.buscarUsuarioPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping
    public ResponseEntity<Object> salvarUsuario(@Valid @RequestBody UsuarioRequestDTO requestDTO) {
        try {
            UsuarioResponseDTO novoUsuario = usuarioService.salvar(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletarUsuario(@PathVariable UUID id) {
        try {
            usuarioService.deletarUsuario(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<Object> autenticarUsuario(@Valid @RequestBody LoginRequestDTO request) {
        try {
            UsuarioResponseDTO usuarioLogado = usuarioService.autenticarUsuario(request);
            return ResponseEntity.ok(usuarioLogado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
