package com.acervo.backend.dto;

import java.util.UUID;

public record EmprestimoRequestDTO(
     UUID usuarioId,
     UUID livroId
) {   
}
