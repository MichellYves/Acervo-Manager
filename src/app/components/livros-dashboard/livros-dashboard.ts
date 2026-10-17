import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import{ Router } from '@angular/router';

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  status: 'disponível' | 'emprestado' | 'reservado';
  capa: string;
  ano: number;
}

@Component({
  selector: 'app-livros-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './livros-dashboard.html',
})

export class LivrosDashboardComponent implements OnInit {
    usuarioLogado = { nome: 'Usuário', avatar: 'https://liara.run' };

  //Lista Mockada (Simulado o que virá do Node.js futuramente)
    livros: Livro[] = [
        { id: 1, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', status: 'disponível', capa: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSEDEwiGpOpEfwj4jCt9aIdcYiWjhUEwLXcD2vmxZCZg&s=10', ano: 1954 },
        { id: 2, titulo: '1984', autor: 'George Orwell', status: 'emprestado', capa: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb9jTZOnBXXVodW-XvQjxWwKWd2JeSIPJlEIAvte3_3w&s', ano: 1949 },
        { id: 3, titulo: 'O Pequeno Príncipe', autor: 'Antoine de Saint-Exupéry', status: 'reservado', capa: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRW6ab-5SsU-7U2yQynPJugAv3SIWnMdkFTHegqN0VdsQ&s=10', ano: 1943 },
        { id: 4, titulo: 'A Revolução dos Bichos', autor: 'George Orwell', status: 'disponível', capa: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCZoC-ISNYQNOvscBYSZ6WqaC_YQqhO6RDozZOgnoNYg&s=10', ano: 1945 },
        { id: 5, titulo: 'O Hobbit', autor: 'J.R.R. Tolkien', status: 'emprestado', capa: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgDBwMP1i0iiIUPl9D-Ka00PJQyQRRgRxGNDj-aelcVg&s=10', ano: 1937 }
    ];

    livrosFiltrados: Livro[] = [...this.livros];
    termoBusca: string = '';
    filtroStatus: 'todos' | 'disponível' | 'emprestado' | 'reservado' = 'todos';

    constructor (private router: Router) {}

    ngOnInit(): void {
        this.filtrarAcervo();
    }

    filtrarAcervo(): void {
        const termo = this.termoBusca.trim().toLowerCase();

        this.livrosFiltrados = this.livros.filter((livro) => {
            const bateStatus = this.filtroStatus === 'todos' || livro.status === this.filtroStatus;
            const bateBusca = !termo ||
                livro.titulo.toLowerCase().includes(termo) ||
                livro.autor.toLowerCase().includes(termo) ||
                String(livro.ano).includes(termo);

            return bateStatus && bateBusca;
        });
    }

    mudarFiltro(status: string): void {
        this.filtroStatus = status as 'todos' | 'disponível' | 'emprestado' | 'reservado';
        this.filtrarAcervo();
    }   

    fazerLogout(): void {
        // Aqui você pode adicionar a lógica de logout, como limpar tokens, redirecionar para a página de login, etc.
        this.router.navigate(['/login']); // Redireciona para a página de login
    }
}