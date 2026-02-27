import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { finalize } from 'rxjs';
import {NoData} from "@shared/components/no-data/no-data";
import {AppButton} from "@shared/components/app-button/app-button";
import {UserService} from '@pages/users/user.service';
import {JwtService} from '@shared/service/jwt.service';
import {Role, User} from '@shared/interfaces/user.interface';
import {TagList} from '@shared/components/tag-list/tag-list';
import {PluckPipe} from '@shared/pipes/pluck-pipe';
import {SearchInput} from '@shared/components/search-input/search-input';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DrawerModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    MultiSelectModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ConfirmDialogModule,
    ToastModule,
    NoData,
    AppButton,
    CardModule,
    TagList,
    PluckPipe,
    SearchInput,
    Tooltip
  ],
  providers: [ConfirmationService, MessageService, PluckPipe],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {
  private userService = inject(UserService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  jwtService = inject(JwtService);
  pluckPipe = inject(PluckPipe);

  users = signal<User[]>([]);
  roles = signal<Role[]>([]);
  loading = signal<boolean>(false);

  // Pagination State
  totalRecords = signal<number>(0);
  rows = signal<number>(10);
  first = signal<number>(0);
  searchQuery = signal<string>('');
  sortField = signal<string>('');
  sortOrder = signal<number>(1);

  showUserDialog = signal<boolean>(false);

  userForm: FormGroup = this.fb.group({
    id: [null],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    roleIds: [[], Validators.required],
    active: [1, Validators.required]
  });

  isEditUser = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  constructor() {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.userService.getRoles(0, 100).subscribe({
      next: (roles) => this.roles.set(roles.data.records)
    });
  }

  onLazyLoad(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
    if (event.sortField) {
      this.sortField.set(event.sortField);
      this.sortOrder.set(event.sortOrder);
    }
    this.loadUsers();
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.first.set(0);
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    const page = this.first() / this.rows();
    const sort = this.sortField() ? `${this.sortField()},${this.sortOrder() === 1 ? 'asc' : 'desc'}` : undefined;
    this.userService.getUsers(page, this.rows(), this.searchQuery() || undefined, sort).subscribe({
      next: (res) => {
        this.users.set(res.records);
        this.totalRecords.set(res.totalRecords);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadData() {
    this.loadUsers();
  }

  // User Methods
  openNewUser() {
    this.userForm.reset({ active: true });
    this.isEditUser.set(false);
    this.showUserDialog.set(true);
  }

  editUser(user: User) {
    this.userForm.patchValue({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      roleIds: this.pluckPipe.transform(user.roles || [], 'id'),
      active: user.active
    });
    this.isEditUser.set(true);
    this.showUserDialog.set(true);
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete user "${user.fullName}"?`,
      header: 'Confirmation',
      closable: true,
      icon: 'fa fa-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
      },
      acceptButtonProps: {
        label: 'Yes, Delete',
        severity: 'danger',
      },
      accept: () => {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.loadData();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
          },
          error: (err) => {
            if (err.status !== 403) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to delete user' });
            }
          }
        });
      }
    });
  }

  saveUser() {
    if (this.userForm.valid) {
      this.isSaving.set(true);
      const userData = this.userForm.value;
      const action = this.isEditUser()
        ? this.userService.updateUser(userData.id, userData)
        : this.userService.createUser(userData);

      action.pipe(finalize(() => this.isSaving.set(false))).subscribe({
        next: (savedUser) => {
          this.loadData();
          if (this.isEditUser()) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
          }
          if (!this.isEditUser()) {
            this.userForm.reset({ active: true });
          }
        },
        error: (err) => {
          if (err.status !== 403) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save user' });
          }
        }
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
