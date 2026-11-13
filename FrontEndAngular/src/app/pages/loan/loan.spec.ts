import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Emprestimos } from './loan';

describe('Emprestimos', () => {
  let fixture: ComponentFixture<Emprestimos>;
  let component: Emprestimos;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Emprestimos],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Emprestimos);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('cria o componente', () => {
    expect(component).toBeTruthy();
  });

  it('lista os empréstimos com livro e leitor', () => {
    expect(el.querySelectorAll('.linha:not(.cab)').length).toBe(component.emprestimos().length);
    expect(el.textContent).toContain('Dom Casmurro');
    expect(el.textContent).toContain('Ana Beatriz Souza');
  });

  it('calcula atrasados a partir do prazo', () => {
    const atrasados = component.itens().filter(i => i.status === 'atrasado');
    expect(atrasados.length).toBeGreaterThan(0);
    expect(atrasados.every(i => i.dias > 0)).toBe(true);
  });

  it('registra a devolução e muda o status', () => {
    component.devolver(2);
    const item = component.itens().find(i => i.id === 2);
    expect(item?.status).toBe('devolvido');
    expect(component.aviso()).toContain('Vidas Secas');
  });

  it('filtra por status e por busca', () => {
    component.mudar({ status: 'atrasado' });
    expect(component.filtrados().every(i => i.status === 'atrasado')).toBe(true);
    component.limpar();
    component.mudar({ busca: 'joão pedro' });
    expect(component.filtrados().every(i => i.leitor.nome.includes('João Pedro'))).toBe(true);
  });

  it('tem o botão que volta para a home', () => {
    const voltar = el.querySelector('a.voltar');
    expect(voltar?.textContent).toContain('Voltar para a home');
    expect(voltar?.getAttribute('href')).toBe('/');
  });
});