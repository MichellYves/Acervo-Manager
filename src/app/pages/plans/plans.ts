import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  limits: {
    maxBooks: string;
    maxUsers: string;
  };
  recommended?: boolean;
}

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.html',
  styleUrl: './plans.css'
})
export class PlansComponent {
  plans: Plan[] = [
    {
      id: 'silver',
      name: 'Silver',
      price: 'R$ 49',
      period: '/mês',
      description: 'Ideal para pequenos acervos e bibliotecas comunitárias.',
      limits: {
        maxBooks: 'Até 1.000 livros',
        maxUsers: 'Até 200 leitores cadastrados'
      },
      features: [
        'Cadastro e consulta de livros',
        'Registro de empréstimos e devoluções',
        'Validações básicas de acervo',
        'Suporte via e-mail'
      ]
    },
    {
      id: 'gold',
      name: 'Gold',
      price: 'R$ 119',
      period: '/mês',
      description: 'Perfeito para escolas e faculdades de médio porte.',
      recommended: true,
      limits: {
        maxBooks: 'Até 10.000 livros',
        maxUsers: 'Até 2.000 leitores cadastrados'
      },
      features: [
        'Todas as funcionalidades do Silver',
        'Consulta de disponibilidade em tempo real',
        'Relatórios de empréstimos e atrasos',
        'Notificações automáticas de devolução',
        'Suporte prioritário'
      ]
    },
    {
      id: 'diamond',
      name: 'Diamond',
      price: 'R$ 249',
      period: '/mês',
      description: 'Para redes de bibliotecas e grandes acervos corporativos.',
      limits: {
        maxBooks: 'Livros ilimitados',
        maxUsers: 'Leitores ilimitados'
      },
      features: [
        'Todas as funcionalidades do Gold',
        'API REST dedicada para integrações',
        'Múltiplas unidades/unidades escolares',
        'Backup automatizado do banco MySQL',
        'Suporte 24/7 com gerente dedicado'
      ]
    }
  ];

  selectPlan(plan: Plan) {
    alert(`Plano selecionado: ${plan.name}`);
  }
}