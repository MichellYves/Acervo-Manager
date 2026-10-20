import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';

describe('Home', () => {
  let fixture: ComponentFixture<Home>;
  let component: Home;
  let el: HTMLElement;

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
    component.alternarPerfil();
    fixture.detectChanges();
    expect(el.querySelector('h1')?.textContent).toContain('Olá');
    expect(el.textContent).not.toContain('Adicionar livro');
  });

  it('cliente só enxerga livros disponíveis', () => {
    component.alternarPerfil();
    expect(component.filtrados().every(l => l.status === 'disponivel')).toBe(true);
  });

  it('reserva um livro disponível e o move para as reservas do cliente', () => {
    component.alternarPerfil();
    component.reservar(1, 'Dom Casmurro');
    expect(component.livros().find(l => l.id === 1)?.status).toBe('reservado');
    expect(component.minhas().some(l => l.id === 1)).toBe(true);
  });

  it('filtra por busca e por gênero', () => {
    component.mudar({ busca: 'clarice' });
    expect(component.filtrados().every(l => l.autor.includes('Clarice'))).toBe(true);
    component.limpar();
    component.mudar({ genero: 'Contos' });
    expect(component.filtrados().every(l => l.genero === 'Contos')).toBe(true);
  });

  it('adiciona um livro novo ao acervo', () => {
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