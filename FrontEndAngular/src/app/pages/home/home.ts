import { Component, computed, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type Perfil = 'admin' | 'cliente';
type Status = 'disponivel' | 'reservado' | 'emprestado';
type Tema = 'claro' | 'escuro';

interface Livro {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  ano: number;
  status: Status;
  capa?: string; // URL ou data URL
  reservadoPor?: string;
}

interface Filtro {
  busca: string;
  status: 'todos' | Status;
  genero: string; // 'todos' ou o nome do gênero
  ordem: 'titulo' | 'autor' | 'ano';
}

const FILTRO_INICIAL: Filtro = { busca: '', status: 'todos', genero: 'todos', ordem: 'titulo' };
const CORES = ['#2f4858', '#4a5d4f', '#6b4f4a', '#3d3f5c', '#5c5a3d', '#35566b'];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.css',
})
export class Home {
  // ---- Usuário (troque pelo seu login/API) ----
  usuario = signal<{ nome: string; perfil: Perfil }>({ nome: 'Marina', perfil: 'admin' });

  // ---- Tema ----
  tema = signal<Tema>(this.temaInicial());

  // ---- Dados de exemplo (troque por chamadas HttpClient) ----
  livros = signal<Livro[]>([
    { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', genero: 'Romance', ano: 1899, status: 'disponivel' },
    { id: 2, titulo: 'Grande Sertão: Veredas', autor: 'João Guimarães Rosa', genero: 'Romance', ano: 1956, status: 'disponivel' },
    { id: 3, titulo: 'Vidas Secas', autor: 'Graciliano Ramos', genero: 'Romance', ano: 1938, status: 'emprestado' },
    { id: 4, titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', genero: 'Romance', ano: 1881, status: 'disponivel' },
    { id: 5, titulo: 'A Hora da Estrela', autor: 'Clarice Lispector', genero: 'Ficção', ano: 1977, status: 'reservado', reservadoPor: 'João' },
    { id: 6, titulo: 'Sagarana', autor: 'João Guimarães Rosa', genero: 'Contos', ano: 1946, status: 'disponivel' },
    { id: 7, titulo: 'Laços de Família', autor: 'Clarice Lispector', genero: 'Contos', ano: 1960, status: 'disponivel' },
  ]);

  // ---- Estado de tela ----
  filtro = signal<Filtro>({ ...FILTRO_INICIAL });
  formAberto = signal(false);
  erro = signal('');
  aviso = signal('');
  novo = this.novoVazio();

  statusOpcoes: { valor: Filtro['status']; rotulo: string }[] = [
    { valor: 'todos', rotulo: 'Todos' },
    { valor: 'disponivel', rotulo: 'Disponíveis' },
    { valor: 'reservado', rotulo: 'Reservados' },
    { valor: 'emprestado', rotulo: 'Emprestados' },
  ];

  // ---- Derivados ----
  ehAdmin = computed(() => this.usuario().perfil === 'admin');
  total = computed(() => this.livros().length);
  disponiveisQtd = computed(() => this.livros().filter(l => l.status === 'disponivel').length);
  indisponiveisQtd = computed(() => this.total() - this.disponiveisQtd());

  /** Admin enxerga todo o acervo; cliente só os disponíveis. */
  base = computed(() => this.ehAdmin() ? this.livros() : this.livros().filter(l => l.status === 'disponivel'));
  generos = computed(() => [...new Set(this.base().map(l => l.genero))].sort());
  contagem = computed(() => {
    const b = this.base();
    return {
      todos: b.length,
      disponivel: b.filter(l => l.status === 'disponivel').length,
      reservado: b.filter(l => l.status === 'reservado').length,
      emprestado: b.filter(l => l.status === 'emprestado').length,
    };
  });
  filtroAtivo = computed(() => {
    const f = this.filtro();
    return !!f.busca || f.status !== 'todos' || f.genero !== 'todos';
  });
  filtrados = computed(() => {
    const f = this.filtro();
    const q = f.busca.toLowerCase().trim();
    return this.base()
      .filter(l =>
        (f.status === 'todos' || l.status === f.status) &&
        (f.genero === 'todos' || l.genero === f.genero) &&
        (!q || l.titulo.toLowerCase().includes(q) || l.autor.toLowerCase().includes(q)))
      .sort((a, b) =>
        f.ordem === 'ano' ? b.ano - a.ano
        : f.ordem === 'autor' ? a.autor.localeCompare(b.autor)
        : a.titulo.localeCompare(b.titulo));
  });
  minhas = computed(() =>
    this.livros().filter(l => l.status === 'reservado' && l.reservadoPor === this.usuario().nome));

  // ---- Tema / perfil ----
  alternarTema() {
    const t: Tema = this.tema() === 'claro' ? 'escuro' : 'claro';
    this.tema.set(t);
    try { localStorage.setItem('acervo-tema', t); } catch {}
  }

  /** Só para visualizar as duas telas. Remover depois em produção. */
  alternarPerfil() {
    this.usuario.update(u => u.perfil === 'admin'
      ? { nome: 'João', perfil: 'cliente' }
      : { nome: 'Marina', perfil: 'admin' });
    this.filtro.set({ ...FILTRO_INICIAL });
    this.aviso.set('');
    this.formAberto.set(false);
  }

  sair() { /* limpar sessão e navegar para /login */ }

  // ---- Filtro ----
  mudar(parcial: Partial<Filtro>) { this.filtro.update(f => ({ ...f, ...parcial })); }
  limpar() { this.filtro.update(f => ({ ...FILTRO_INICIAL, ordem: f.ordem })); }

  // ---- Ações do administrador ----
  salvar() {
    const id = Math.max(0, ...this.livros().map(l => l.id)) + 1;
    this.livros.update(l => [{ ...this.novo, id, status: 'disponivel' }, ...l]);
    this.novo = this.novoVazio();
    this.formAberto.set(false);
  }

  remover(id: number, titulo: string) {
    if (confirm(`Remover "${titulo}" do acervo?`)) this.livros.update(l => l.filter(x => x.id !== id));
  }

  alterarStatus(id: number, status: Status) {
    this.livros.update(l => l.map(x => x.id === id
      ? { ...x, status, reservadoPor: status === 'reservado' ? x.reservadoPor : undefined }
      : x));
  }

  async escolherCapaNovo(ev: Event) {
    const arq = (ev.target as HTMLInputElement).files?.[0];
    if (!arq) return;
    try { this.novo.capa = await this.lerCapa(arq); this.erro.set(''); }
    catch (e) { this.erro.set(String(e)); }
  }

  async trocarCapa(id: number, ev: Event) {
    const arq = (ev.target as HTMLInputElement).files?.[0];
    if (!arq) return;
    try {
      const capa = await this.lerCapa(arq);
      this.livros.update(l => l.map(x => x.id === id ? { ...x, capa } : x));
    } catch (e) { alert(String(e)); }
  }

  // ---- Ações do cliente ----
  reservar(id: number, titulo: string) {
    this.livros.update(l => l.map(x => x.id === id && x.status === 'disponivel'
      ? { ...x, status: 'reservado' as Status, reservadoPor: this.usuario().nome } : x));
    this.aviso.set(`"${titulo}" reservado. Retire na biblioteca no balcão de atendimento.`);
  }

  cancelar(id: number) {
    this.alterarStatus(id, 'disponivel');
    this.aviso.set('Reserva cancelada.');
  }

  // ---- Utilitários ----
  cor(id: number) { return CORES[id % CORES.length]; }

  /** Em produção, envie o arquivo para sua API/storage e guarde só a URL. */
  private lerCapa(arquivo: File): Promise<string> {
    return new Promise((ok, erro) => {
      if (!arquivo.type.startsWith('image/')) return erro('Escolha um arquivo de imagem.');
      if (arquivo.size > 2_000_000) return erro('A imagem deve ter até 2 MB.');
      const r = new FileReader();
      r.onload = () => ok(r.result as string);
      r.onerror = () => erro('Não foi possível ler a imagem.');
      r.readAsDataURL(arquivo);
    });
  }

  private novoVazio(): { titulo: string; autor: string; genero: string; ano: number; capa?: string } {
    return { titulo: '', autor: '', genero: '', ano: new Date().getFullYear() };
  }

  private temaInicial(): Tema {
    try {
      const s = localStorage.getItem('acervo-tema');
      if (s === 'claro' || s === 'escuro') return s;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
    } catch { return 'claro'; }
  }
}