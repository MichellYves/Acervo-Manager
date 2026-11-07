import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Loan {
  id: number;
  user: string;
  book: string;
  loanDate: string;
  dueDate: string;
  status: 'EM_ANDAMENTO' | 'DEVOLVIDO' | 'ATRASADO';
}

@Component({
  selector: 'app-loan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan.html',
  styleUrls: []
})
export class LoanComponent implements OnInit {
  
  loans: Loan[] = [ ];

  filterStatus: string = 'TODOS';
  searchTerm: string = '';
  
  isModalOpen: boolean = false;
  newLoan = {
    userId: null,
    bookId: null,
    dueDate: ''
  };

  availableUsers = [
    { id: 1, name: 'Ana Silva' },
    { id: 2, name: 'Carlos Souza' },
    { id: 3, name: 'Mariana Lima' }
  ];

  availableBooks = [
    { id: 101, title: 'Domain-Driven Design' },
    { id: 102, title: 'Entendendo Algoritmos' }
  ];

  ngOnInit(): void {}

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newLoan = { userId: null, bookId: null, dueDate: '' };
  }

  saveLoan() {
    if (!this.newLoan.userId || !this.newLoan.bookId || !this.newLoan.dueDate) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    this.loans.unshift({
      id: Date.now(),
      user: this.availableUsers.find(u => u.id == Number(this.newLoan.userId))?.name || 'Utilizador',
      book: this.availableBooks.find(b => b.id == Number(this.newLoan.bookId))?.title || 'Livro',
      loanDate: new Date().toISOString().split('T')[0],
      dueDate: this.newLoan.dueDate,
      status: 'EM_ANDAMENTO'
    });

    this.closeModal();
  }

  registerReturn(id: number) {
    const loan = this.loans.find(l => l.id === id);
    if (loan) {
      loan.status = 'DEVOLVIDO';
    }
  }

  get filteredLoans() {
    return this.loans.filter(l => {
      const matchStatus = this.filterStatus === 'TODOS' || l.status === this.filterStatus;
      const matchTerm = l.user.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
                        l.book.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchStatus && matchTerm;
    });
  }
}