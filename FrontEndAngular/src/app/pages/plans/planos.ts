import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

type Tema = 'claro' | 'escuro';

interface Plano {
  nome: string;
  preco: number;
  livros: string;
  leitores: string;
  recursos: string[];
  destaque?: boolean;
}

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './planos.component.html',
  styleUrl: './planos.css',
})
export class Planos {
  tema = signal<Tema>(this.temaInicial());
  escolhido = signal<Plano | null>(null);

  planos: Plano[] = [
    {
      nome: 'Silver',
      preco: 49,
      livros: 'Até 1.000 livros',
      leitores: 'Até 200 leitores cadastrados',
      recursos: [
        'Cadastro e consulta de livros',
        'Registro de empréstimos e devoluções',
        'Validações básicas de acervo',
        'Suporte via e-mail',
      ],
    },
    {
      nome: 'Gold',
      preco: 119,
      destaque: true, // remova se não quiser o selo "Mais escolhido"
      livros: 'Até 10.000 livros',
      leitores: 'Até 2.000 leitores cadastrados',
      recursos: [
        'Todas as funcionalidades do Silver',
        'Consulta de disponibilidade em tempo real',
        'Relatórios de empréstimos e atrasos',
        'Notificações automáticas de devolução',
        'Suporte prioritário',
      ],
    },
    {
      nome: 'Diamond',
      preco: 249,
      livros: 'Livros ilimitados',
      leitores: 'Leitores ilimitados',
      recursos: [
        'Todas as funcionalidades do Gold',
        'API REST dedicada para integrações',
        'Múltiplas unidades/unidades escolares',
        'Backup automatizado do banco MySQL',
        'Suporte 24/7 com gerente dedicado',
      ],
    },
  ];

  escolher(plano: Plano) {
    // Aqui entra a navegação para o checkout/contratação.
    this.escolhido.set(plano);
  }

  alternarTema() {
    const t: Tema = this.tema() === 'claro' ? 'escuro' : 'claro';
    this.tema.set(t);
    try { localStorage.setItem('acervo-tema', t); } catch {}
  }

  private temaInicial(): Tema {
    try {
      const s = localStorage.getItem('acervo-tema'); // mesma chave da Home
      if (s === 'claro' || s === 'escuro') return s;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
    } catch { return 'claro'; }
  }
}
