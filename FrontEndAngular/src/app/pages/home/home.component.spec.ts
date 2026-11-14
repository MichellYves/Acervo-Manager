import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let component: Home;
  let el: HTMLElement;

  const paraCliente = () => { component.alternarPerfil(); fixture.detectChanges(); };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Home] }).compileComponents();
    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('cria o componente', () => {
    expect(component).toBeTruthy();
  });

  it('mostra a visão do administrador por padrão', () => {
    expect(el.querySelector('h1')?.textContent).toContain('Acervo');
    expect(el.textContent).toContain('Adicionar livro');
  });

  it('mostra a visão do cliente ao alternar o perfil', () => {
    paraCliente();
    expect(el.querySelector('h1')?.textContent).toContain('Olá');
    expect(el.textContent).not.toContain('Adicionar livro');
  });

  it('cliente só enxerga livros disponíveis na lista principal', () => {
    paraCliente();
    expect(component.lista().every(l => l.status === 'disponivel')).toBe(true);
  });

  it('reserva um livro, gera o código de retirada e o QR', () => {
    paraCliente();
    const livro = component.livros().find(l => l.id === 1)!;
    component.abrirReserva(livro);
    component.confirmarReserva();
    const reservado = component.livros().find(l => l.id === 1)!;
    expect(reservado.status).toBe('reservado');
    expect(reservado.codigo).toMatch(/^AM-[A-HJKMNP-Z2-9]{4}$/);
    expect(component.minhas().some(l => l.id === 1)).toBe(true);
    expect(component.codigoNovo()).toBe(true);
    expect(component.qr()?.d.length).toBeGreaterThan(0);
  });

  it('cancelar a reserva remove o código', () => {
    paraCliente();
    component.cancelar(5);
    const l = component.livros().find(x => x.id === 5)!;
    expect(l.status).toBe('disponivel');
    expect(l.codigo).toBeUndefined();
  });

  it('classifica o prazo de devolução e avisa sobre multa', () => {
    expect(component.estado(6)).toBe('ok');
    expect(component.estado(1)).toBe('near');
    expect(component.estado(-2)).toBe('late');
    expect(component.tempo(-2)).toContain('multa');
    paraCliente();
    expect(component.situacao().atraso).toBe(true);
  });

  it('alterna favoritos e aviso de retorno', () => {
    paraCliente();
    component.alternarFavorito(1);
    expect(component.eFavorito(1)).toBe(true);
    component.alternarFavorito(1);
    expect(component.eFavorito(1)).toBe(false);
    const emprestado = component.livros().find(l => l.id === 4)!;
    component.alternarAviso(emprestado);
    expect(component.temAviso(4)).toBe(true);
  });

  it('filtra a lista do cliente por busca e gênero', () => {
    paraCliente();
    component.mudar({ busca: 'machado' });
    expect(component.lista().every(l => l.autor.includes('Machado'))).toBe(true);
    component.limpar();
    component.mudar({ genero: 'Contos' });
    expect(component.lista().every(l => l.genero === 'Contos')).toBe(true);
  });

  it('administrador adiciona um livro novo', () => {
    const antes = component.total();
    component.novo = { titulo: 'Novo', autor: 'Autor', genero: 'Teste', ano: 2024 };
    component.salvar();
    expect(component.total()).toBe(antes + 1);
  });

  it('alterna o tema claro/escuro', () => {
    const inicial = component.tema();
    component.alternarTema();
    expect(component.tema()).not.toBe(inicial);
  });
});