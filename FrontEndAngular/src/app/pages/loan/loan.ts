import { Component, computed, signal } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type Tema = 'claro' | 'escuro';
type StatusEmp = 'andamento' | 'atrasado' | 'devolvido';

interface Emprestimo {
  id: number;
  livro: { id: number; titulo: string; autor: string; capa?: string };
  leitor: { nome: string; email: string };
  emprestadoEm: string; // yyyy-mm-dd
  prazo: string;        // yyyy-mm-dd (devolução prevista)
  devolvidoEm?: string; // yyyy-mm-dd
}

interface Item extends Emprestimo {
  status: StatusEmp;
  /** atrasado: dias de atraso · andamento: dias restantes */
  dias: number;
}

interface Filtro {
  busca: string;
  status: 'todos' | StatusEmp;
  ordem: 'recentes' | 'prazo' | 'leitor';
}

const FILTRO_INICIAL: Filtro = { busca: '', status: 'todos', ordem: 'recentes' };
const CORES = ['#2f4858', '#4a5d4f', '#6b4f4a', '#3d3f5c', '#5c5a3d', '#35566b'];
const DIA = 86_400_000;

/** yyyy-mm-dd de hoje + n dias (usado só nos dados de exemplo). */
function dia(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

@Component({
  selector: 'app-emprestimos',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, NgTemplateOutlet],
  templateUrl: './loan.html',
  styleUrl: './loan.css',
})
export class Emprestimos {
  tema = signal<Tema>(this.temaInicial());

  // Dados de exemplo: troque por chamadas HttpClient à sua API.
  emprestimos = signal<Emprestimo[]>([
    { id: 1, livro: { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis' },
      leitor: { nome: 'Ana Beatriz Souza', email: 'ana.souza@email.com' }, emprestadoEm: dia(-10), prazo: dia(4) },
    { id: 2, livro: { id: 3, titulo: 'Vidas Secas', autor: 'Graciliano Ramos' },
      leitor: { nome: 'Carlos Henrique Lima', email: 'carlos.lima@email.com' }, emprestadoEm: dia(-21), prazo: dia(-7) },
    { id: 3, livro: { id: 8, titulo: 'O Cortiço', autor: 'Aluísio Azevedo' },
      leitor: { nome: 'Marina Alves', email: 'marina.alves@email.com' }, emprestadoEm: dia(-5), prazo: dia(9) },
    { id: 4, livro: { id: 5, titulo: 'Laços de Família', autor: 'Clarice Lispector' },
      leitor: { nome: 'Fernanda Ribeiro', email: 'fernanda.r@email.com' }, emprestadoEm: dia(-16), prazo: dia(-2) },
    { id: 5, livro: { id: 6, titulo: 'A Hora da Estrela', autor: 'Clarice Lispector' },
      leitor: { nome: 'João Pedro Santos', email: 'joao.santos@email.com' }, emprestadoEm: dia(-3), prazo: dia(11) },
    { id: 6, livro: { id: 7, titulo: 'Sagarana', autor: 'João Guimarães Rosa' },
      leitor: { nome: 'João Pedro Santos', email: 'joao.santos@email.com' }, emprestadoEm: dia(-30), prazo: dia(-16), devolvidoEm: dia(-18) },
    { id: 7, livro: { id: 4, titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis' },
      leitor: { nome: 'Rafael Mendes', email: 'rafael.m@email.com' }, emprestadoEm: dia(-40), prazo: dia(-26), devolvidoEm: dia(-27) },
  ]);

  filtro = signal<Filtro>({ ...FILTRO_INICIAL });
  aviso = signal('');

  statusOpcoes: { valor: Filtro['status']; rotulo: string }[] = [
    { valor: 'todos', rotulo: 'Todos' },
    { valor: 'andamento', rotulo: 'Em andamento' },
    { valor: 'atrasado', rotulo: 'Atrasados' },
    { valor: 'devolvido', rotulo: 'Devolvidos' },
  ];

  rotulos: Record<StatusEmp, string> = { andamento: 'Em andamento', atrasado: 'Atrasado', devolvido: 'Devolvido' };

  /** Empréstimos com status e dias calculados a partir da data de hoje. */
  itens = computed<Item[]>(() => {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    return this.emprestimos().map(e => {
      const prazo = new Date(e.prazo + 'T00:00:00');
      const diff = Math.round((prazo.getTime() - hoje.getTime()) / DIA); // >0 faltam dias
      if (e.devolvidoEm) return { ...e, status: 'devolvido' as StatusEmp, dias: 0 };
      return diff < 0
        ? { ...e, status: 'atrasado' as StatusEmp, dias: -diff }
        : { ...e, status: 'andamento' as StatusEmp, dias: diff };
    });
  });

  contagem = computed(() => {
    const i = this.itens();
    return {
      todos: i.length,
      andamento: i.filter(x => x.status === 'andamento').length,
      atrasado: i.filter(x => x.status === 'atrasado').length,
      devolvido: i.filter(x => x.status === 'devolvido').length,
    };
  });

  filtroAtivo = computed(() => !!this.filtro().busca || this.filtro().status !== 'todos');

  filtrados = computed(() => {
    const f = this.filtro();
    const q = f.busca.toLowerCase().trim();
    return this.itens()
      .filter(e =>
        (f.status === 'todos' || e.status === f.status) &&
        (!q || e.livro.titulo.toLowerCase().includes(q) || e.livro.autor.toLowerCase().includes(q) ||
               e.leitor.nome.toLowerCase().includes(q) || e.leitor.email.toLowerCase().includes(q)))
      .sort((a, b) =>
        f.ordem === 'leitor' ? a.leitor.nome.localeCompare(b.leitor.nome)
        : f.ordem === 'prazo' ? a.prazo.localeCompare(b.prazo)
        : b.emprestadoEm.localeCompare(a.emprestadoEm));
  });

  mudar(parcial: Partial<Filtro>) { this.filtro.update(f => ({ ...f, ...parcial })); }
  limpar() { this.filtro.update(f => ({ ...FILTRO_INICIAL, ordem: f.ordem })); }

  devolver(id: number) {
    const item = this.emprestimos().find(e => e.id === id);
    if (!item) return;
    this.emprestimos.update(l => l.map(e => e.id === id ? { ...e, devolvidoEm: dia(0) } : e));
    this.aviso.set(`Devolução de "${item.livro.titulo}" registrada.`);
  }

  iniciais(nome: string) {
    const p = nome.trim().split(/\s+/);
    return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }

  cor(id: number) { return CORES[id % CORES.length]; }

  alternarTema() {
    const t: Tema = this.tema() === 'claro' ? 'escuro' : 'claro';
    this.tema.set(t);
    try { localStorage.setItem('acervo-tema', t); } catch {}
  }

  private temaInicial(): Tema {
    try {
      const s = localStorage.getItem('acervo-tema');
      if (s === 'claro' || s === 'escuro') return s;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
    } catch { return 'claro'; }
  }
}