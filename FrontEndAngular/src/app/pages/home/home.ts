import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import qrcode from 'qrcode-generator'; // npm install qrcode-generator

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
  capa?: string;            // URL ou data URL
  novo?: boolean;           // aparece em "Novidades no acervo"
  reservadoPor?: string;
  codigo?: string;          // código de retirada da reserva
  emprestadoPara?: string;
  diasRestantes?: number;   // do prazo de devolução (negativo = atrasado)
}

interface Filtro {
  busca: string;
  status: 'todos' | Status; // usado só na visão do administrador
  genero: string;           // 'todos' ou o nome do gênero
  ordem: 'titulo' | 'autor' | 'ano';
}

const FILTRO_INICIAL: Filtro = { busca: '', status: 'todos', genero: 'todos', ordem: 'titulo' };
const CORES = ['#2f4858', '#4a5d4f', '#6b4f4a', '#3d3f5c', '#5c5a3d', '#35566b'];
const PRAZO_DIAS = 10;
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // sem 0, O, 1, I, L

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.css',
})
export class Home {
  readonly prazoDias = PRAZO_DIAS;

  // ---- Usuário (troque pelo seu login/API) ----
  usuario = signal<{ nome: string; perfil: Perfil }>({ nome: 'Marina', perfil: 'admin' });

  // ---- Tema ----
  tema = signal<Tema>(this.temaInicial());

  // ---- Dados de exemplo (troque por chamadas HttpClient) ----
  livros = signal<Livro[]>([
    { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis', genero: 'Romance', ano: 1899, status: 'disponivel' },
    { id: 2, titulo: 'Grande Sertão: Veredas', autor: 'João Guimarães Rosa', genero: 'Romance', ano: 1956, status: 'disponivel' },
    { id: 3, titulo: 'Vidas Secas', autor: 'Graciliano Ramos', genero: 'Romance', ano: 1938, status: 'emprestado', emprestadoPara: 'João', diasRestantes: 6 },
    { id: 4, titulo: 'Memórias Póstumas de Brás Cubas', autor: 'Machado de Assis', genero: 'Romance', ano: 1881, status: 'emprestado', emprestadoPara: 'Ana', diasRestantes: 4 },
    { id: 5, titulo: 'A Hora da Estrela', autor: 'Clarice Lispector', genero: 'Ficção', ano: 1977, status: 'reservado', reservadoPor: 'João', codigo: 'AM-7K4Q' },
    { id: 6, titulo: 'Sagarana', autor: 'João Guimarães Rosa', genero: 'Contos', ano: 1946, status: 'disponivel' },
    { id: 7, titulo: 'Laços de Família', autor: 'Clarice Lispector', genero: 'Contos', ano: 1960, status: 'emprestado', emprestadoPara: 'Carlos', diasRestantes: 7 },
    { id: 8, titulo: 'O Cortiço', autor: 'Aluísio Azevedo', genero: 'Romance', ano: 1890, status: 'disponivel' },
    { id: 9, titulo: 'Capitães da Areia', autor: 'Jorge Amado', genero: 'Romance', ano: 1937, status: 'emprestado', emprestadoPara: 'João', diasRestantes: -2 },
    { id: 10, titulo: 'Quincas Borba', autor: 'Machado de Assis', genero: 'Romance', ano: 1891, status: 'emprestado', emprestadoPara: 'João', diasRestantes: 1 },
    { id: 11, titulo: 'Torto Arado', autor: 'Itamar Vieira Junior', genero: 'Romance', ano: 2019, status: 'disponivel', novo: true },
    { id: 12, titulo: 'Úrsula', autor: 'Maria Firmina dos Reis', genero: 'Romance', ano: 1859, status: 'disponivel', novo: true },
    { id: 13, titulo: 'Menino de Engenho', autor: 'José Lins do Rego', genero: 'Romance', ano: 1932, status: 'disponivel', novo: true },
    { id: 14, titulo: 'Perto do Coração Selvagem', autor: 'Clarice Lispector', genero: 'Ficção', ano: 1943, status: 'disponivel', novo: true },
  ]);

  // ---- Estado de tela ----
  filtro = signal<Filtro>({ ...FILTRO_INICIAL });
  formAberto = signal(false);
  erro = signal('');
  novo = this.novoVazio();

  favoritos = signal<number[]>([6, 4]);
  avisos = signal<number[]>([]); // livros emprestados que o leitor quer ser avisado quando voltarem

  pendente = signal<Livro | null>(null);      // livro aguardando confirmação das regras
  codigoAtual = signal<Livro | null>(null);   // reserva exibida no diálogo do código
  codigoNovo = signal(false);

  toastTexto = signal('');
  toastVisivel = signal(false);
  private toastTimer?: ReturnType<typeof setTimeout>;

  private regrasDlg = viewChild.required<ElementRef<HTMLDialogElement>>('regrasDlg');
  private codigoDlg = viewChild.required<ElementRef<HTMLDialogElement>>('codigoDlg');

  statusOpcoes: { valor: Filtro['status']; rotulo: string }[] = [
    { valor: 'todos', rotulo: 'Todos' },
    { valor: 'disponivel', rotulo: 'Disponíveis' },
    { valor: 'reservado', rotulo: 'Reservados' },
    { valor: 'emprestado', rotulo: 'Emprestados' },
  ];

  // ---- Derivados comuns ----
  ehAdmin = computed(() => this.usuario().perfil === 'admin');
  total = computed(() => this.livros().length);
  disponiveis = computed(() => this.livros().filter(l => l.status === 'disponivel'));
  disponiveisQtd = computed(() => this.disponiveis().length);
  indisponiveisQtd = computed(() => this.total() - this.disponiveisQtd());

  generos = computed(() => {
    const nome = this.usuario().nome;
    const fonte = this.ehAdmin()
      ? this.livros()
      : this.livros().filter(l => l.status === 'disponivel' || (l.status === 'emprestado' && l.emprestadoPara !== nome));
    return [...new Set(fonte.map(l => l.genero))].sort();
  });

  filtrando = computed(() => !!this.filtro().busca.trim() || this.filtro().genero !== 'todos');
  filtroAtivo = computed(() => this.filtrando() || this.filtro().status !== 'todos');

  // ---- Administrador ----
  contagem = computed(() => {
    const l = this.livros();
    return {
      todos: l.length,
      disponivel: l.filter(x => x.status === 'disponivel').length,
      reservado: l.filter(x => x.status === 'reservado').length,
      emprestado: l.filter(x => x.status === 'emprestado').length,
    };
  });

  filtrados = computed(() => {
    const f = this.filtro();
    return this.livros()
      .filter(l => (f.status === 'todos' || l.status === f.status) && this.passa(l, f))
      .sort((a, b) => this.ordenar(a, b));
  });

  // ---- Cliente ----
  meusEmprestimos = computed(() =>
    this.livros().filter(l => l.status === 'emprestado' && l.emprestadoPara === this.usuario().nome)
      .sort((a, b) => this.dias(a) - this.dias(b)));
  minhas = computed(() =>
    this.livros().filter(l => l.status === 'reservado' && l.reservadoPor === this.usuario().nome));
  destaque = computed(() => this.disponiveis().find(l => l.id === 2) ?? this.disponiveis()[0]);
  novidades = computed(() => this.disponiveis().filter(l => l.novo));
  lista = computed(() => this.disponiveis().filter(l => this.passa(l, this.filtro())).sort((a, b) => this.ordenar(a, b)));
  emBreve = computed(() =>
    this.livros()
      .filter(l => l.status === 'emprestado' && l.emprestadoPara !== this.usuario().nome && this.passa(l, this.filtro()))
      .sort((a, b) => this.dias(a) - this.dias(b)));
  favoritosLista = computed(() =>
    this.livros().filter(l => this.favoritos().includes(l.id) &&
      (l.status === 'disponivel' || (l.status === 'emprestado' && l.emprestadoPara !== this.usuario().nome))));
  comVoce = computed(() => this.meusEmprestimos().length + this.minhas().length);

  situacao = computed(() => {
    const e = this.meusEmprestimos();
    const atrasados = e.filter(l => this.dias(l) < 0).length;
    if (atrasados) return { atraso: true, texto: `${atrasados} ${atrasados === 1 ? 'livro em atraso' : 'livros em atraso'}` };
    if (e.some(l => this.dias(l) <= 2)) return { atraso: false, texto: 'Devolução se aproximando' };
    return { atraso: false, texto: 'Tudo em dia' };
  });

  /** Módulos do QR code da reserva exibida (renderizado como <path> no template). */
  qr = computed(() => {
    const l = this.codigoAtual();
    if (!l?.codigo) return null;
    const q = qrcode(0, 'M');
    q.addData(`ACERVO|${l.codigo}|${l.id}`);
    q.make();
    const n = q.getModuleCount();
    const margem = 2;
    let d = '';
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if (q.isDark(r, c)) d += `M${c + margem} ${r + margem}h1v1h-1z`;
    return { tam: n + margem * 2, d };
  });

  // ---- Tema / perfil ----
  alternarTema() {
    const t: Tema = this.tema() === 'claro' ? 'escuro' : 'claro';
    this.tema.set(t);
    try { localStorage.setItem('acervo-tema', t); } catch {}
  }

  /** Só para visualizar as duas telas. Remova em produção. */
  alternarPerfil() {
    this.usuario.update(u => u.perfil === 'admin'
      ? { nome: 'João', perfil: 'cliente' }
      : { nome: 'Marina', perfil: 'admin' });
    this.filtro.set({ ...FILTRO_INICIAL });
    this.formAberto.set(false);
  }

  sair() { /* limpar sessão e navegar para /login */ }

  // ---- Filtro ----
  mudar(parcial: Partial<Filtro>) { this.filtro.update(f => ({ ...f, ...parcial })); }
  limpar() { this.filtro.update(f => ({ ...FILTRO_INICIAL, ordem: f.ordem })); }

  // ---- Ações do administrador ----
  salvar() {
    const id = Math.max(0, ...this.livros().map(l => l.id)) + 1;
    this.livros.update(l => [{ ...this.novo, id, status: 'disponivel', novo: true }, ...l]);
    this.novo = this.novoVazio();
    this.formAberto.set(false);
  }

  remover(id: number, titulo: string) {
    if (confirm(`Remover "${titulo}" do acervo?`)) this.livros.update(l => l.filter(x => x.id !== id));
  }

  alterarStatus(id: number, status: Status) {
    this.livros.update(l => l.map(x => x.id !== id ? x : {
      ...x,
      status,
      reservadoPor: status === 'reservado' ? x.reservadoPor : undefined,
      codigo: status === 'reservado' ? x.codigo : undefined,
      emprestadoPara: status === 'emprestado' ? x.emprestadoPara : undefined,
      diasRestantes: status === 'emprestado' ? (x.diasRestantes ?? PRAZO_DIAS) : undefined,
    }));
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

  // ---- Ações do cliente: reserva e código de retirada ----
  abrirReserva(livro: Livro) {
    this.pendente.set(livro);
    this.abrir(this.regrasDlg().nativeElement);
  }

  cancelarPendente() { this.fechar(this.regrasDlg().nativeElement); }

  confirmarReserva() {
    const p = this.pendente();
    if (!p) return;
    // Em produção o código deve ser gerado e guardado pelo servidor.
    const codigo = this.gerarCodigo();
    this.livros.update(l => l.map(x => x.id === p.id && x.status === 'disponivel'
      ? { ...x, status: 'reservado' as Status, reservadoPor: this.usuario().nome, codigo } : x));
    this.fechar(this.regrasDlg().nativeElement);
    const atualizado = this.livros().find(x => x.id === p.id);
    if (atualizado) this.mostrarCodigo(atualizado, true);
  }

  mostrarCodigo(livro: Livro, nova = false) {
    this.codigoAtual.set(livro);
    this.codigoNovo.set(nova);
    this.abrir(this.codigoDlg().nativeElement);
  }

  fecharCodigo() { this.fechar(this.codigoDlg().nativeElement); }

  async copiarCodigo() {
    const c = this.codigoAtual()?.codigo;
    if (!c) return;
    try { await navigator.clipboard.writeText(c); this.mostrarToast('Código copiado.'); }
    catch { this.mostrarToast(`Código: ${c}`); }
  }

  cancelar(id: number) {
    this.livros.update(l => l.map(x => x.id === id
      ? { ...x, status: 'disponivel' as Status, reservadoPor: undefined, codigo: undefined } : x));
    this.mostrarToast('Reserva cancelada.');
  }

  /** Fecha o diálogo ao clicar no fundo escurecido. */
  fora(ev: MouseEvent, dlg: HTMLDialogElement) { if (ev.target === dlg) this.fechar(dlg); }

  // ---- Favoritos e avisos de retorno ----
  eFavorito(id: number) { return this.favoritos().includes(id); }
  alternarFavorito(id: number) {
    const tem = this.eFavorito(id);
    this.favoritos.update(f => tem ? f.filter(x => x !== id) : [...f, id]);
    this.mostrarToast(tem ? 'Removido dos favoritos.' : 'Adicionado aos favoritos.');
  }

  temAviso(id: number) { return this.avisos().includes(id); }
  alternarAviso(l: Livro) {
    const tem = this.temAviso(l.id);
    this.avisos.update(a => tem ? a.filter(x => x !== l.id) : [...a, l.id]);
    this.mostrarToast(tem ? 'Aviso cancelado.' : `Avisaremos você quando “${l.titulo}” voltar.`);
  }

  // ---- Prazo de devolução ----
  dias(l: Livro) { return l.diasRestantes ?? 0; }
  estado(p: number): 'ok' | 'near' | 'late' { return p < 0 ? 'late' : p <= 2 ? 'near' : 'ok'; }
  pl(n: number) { return `${n} ${n === 1 ? 'dia' : 'dias'}`; }
  progresso(p: number) { return Math.max(0, Math.min(100, ((PRAZO_DIAS - p) / PRAZO_DIAS) * 100)); }
  tempo(p: number) {
    return p < 0 ? `Atrasado há ${this.pl(-p)} · sujeito a multa`
      : p === 0 ? 'Vence hoje'
      : p === 1 ? 'Falta 1 dia'
      : `Faltam ${p} dias`;
  }
  ate(p: number) {
    const d = new Date();
    d.setDate(d.getDate() + p);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  // ---- Utilitários ----
  cor(id: number) { return CORES[id % CORES.length]; }

  mostrarToast(msg: string) {
    this.toastTexto.set(msg);
    this.toastVisivel.set(true);
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisivel.set(false), 3200);
  }

  private passa(l: Livro, f: Filtro) {
    const q = f.busca.toLowerCase().trim();
    return (f.genero === 'todos' || l.genero === f.genero) &&
      (!q || l.titulo.toLowerCase().includes(q) || l.autor.toLowerCase().includes(q));
  }

  private ordenar(a: Livro, b: Livro) {
    const o = this.filtro().ordem;
    return o === 'ano' ? b.ano - a.ano : o === 'autor' ? a.autor.localeCompare(b.autor) : a.titulo.localeCompare(b.titulo);
  }

  private gerarCodigo() {
    let s = 'AM-';
    for (let i = 0; i < 4; i++) s += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
    return s;
  }

  private abrir(d: HTMLDialogElement) { typeof d.showModal === 'function' ? d.showModal() : d.setAttribute('open', ''); }
  private fechar(d: HTMLDialogElement) { typeof d.close === 'function' ? d.close() : d.removeAttribute('open'); }

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