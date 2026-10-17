import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LivrosDashboardComponent } from './livros-dashboard';

describe('LivrosDashboard', () => {
  let component: LivrosDashboardComponent;
  let fixture: ComponentFixture<LivrosDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivrosDashboardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LivrosDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
