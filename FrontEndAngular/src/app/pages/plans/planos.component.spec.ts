import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Planos } from './planos';

describe('Planos', () => {
  let fixture: ComponentFixture<Planos>;
  let component: Planos;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Planos],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(Planos);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('cria o componente', () => {
    expect(component).toBeTruthy();
  });

  it('mostra os três planos com nome e preço', () => {
    const cards = el.querySelectorAll('.plano');
    expect(cards.length).toBe(3);
    expect(el.textContent).toContain('Silver');
    expect(el.textContent).toContain('Gold');
    expect(el.textContent).toContain('Diamond');
    expect(component.planos.map(p => p.preco)).toEqual([49, 119, 249]);
  });

  it('tem o botão que volta para a home', () => {
    const voltar = el.querySelector('a.voltar');
    expect(voltar?.textContent).toContain('Voltar para a home');
    expect(voltar?.getAttribute('href')).toBe('/');
  });

  it('marca o plano escolhido', () => {
    component.escolher(component.planos[1]);
    fixture.detectChanges();
    expect(el.querySelector('.aviso')?.textContent).toContain('Gold');
  });

  it('alterna o tema', () => {
    const inicial = component.tema();
    component.alternarTema();
    expect(component.tema()).not.toBe(inicial);
  });
});
