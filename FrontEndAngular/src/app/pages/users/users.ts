import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Usuário' | 'Editor';
  status: 'Ativo' | 'Inativo';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent {
  userForm: FormGroup;
  isEditing = signal(false);
  currentUserId = signal<string | null>(null);
  searchTerm = signal('');
  selectedRole = signal('');

  users = signal<User[]>([
    
  ]);

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const role = this.selectedRole();

    return this.users().filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
      const matchesRole = role ? user.role === role : true;
      return matchesSearch && matchesRole;
    });
  });

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['Usuário', Validators.required],
      status: ['Ativo', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formValue = this.userForm.value;

    if (this.isEditing()) {
      this.users.update(list => 
        list.map(user => user.id === this.currentUserId() ? { ...user, ...formValue } : user)
      );
      this.cancelEdit();
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formValue
      };
      this.users.update(list => [newUser, ...list]);
      this.userForm.reset({ role: 'Usuário', status: 'Ativo' });
    }
  }

  editUser(user: User) {
    this.isEditing.set(true);
    this.currentUserId.set(user.id);
    this.userForm.patchValue(user);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.currentUserId.set(null);
    this.userForm.reset({ role: 'Usuário', status: 'Ativo' });
  }

  deleteUser(id: string) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.users.update(list => list.filter(user => user.id !== id));
      if (this.currentUserId() === id) {
        this.cancelEdit();
      }
    }
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onFilterRole(event: Event) {
    this.selectedRole.set((event.target as HTMLSelectElement).value);
  }
}