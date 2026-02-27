import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Role, Permission } from '@shared/interfaces/user.interface';
import { finalize } from 'rxjs';
import {AppButton} from "@shared/components/app-button/app-button";
import {Card} from "primeng/card";
import {UserService} from '@pages/users/user.service';
import {TagList} from '@shared/components/tag-list/tag-list';
import {PluckPipe} from '@shared/pipes/pluck-pipe';
import {SearchInput} from '@shared/components/search-input/search-input';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    MultiSelectModule,
    TagModule,
    ToastModule,
    AppButton,
    Card,
    TagList,
    PluckPipe,
    SearchInput,
    Tooltip
  ],
  providers: [MessageService],
  templateUrl: './roles.html'
})
export class Roles implements OnInit {
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  roles = signal<Role[]>([]);
  permissions = signal<Permission[]>([]);
  loading = signal<boolean>(false);

  // Pagination State
  totalRecords = signal<number>(0);
  rows = signal<number>(10);
  first = signal<number>(0);
  searchQuery = signal<string>('');
  sortField = signal<string>('');
  sortOrder = signal<number>(1);

  showRoleDialog = signal<boolean>(false);
  showPermissionsDialog = signal<boolean>(false);
  selectedPermissions = signal<Permission[]>([]);
  selectedRoleName = signal<string>('');
  roleForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', [Validators.required]],
    permissions: [[], [Validators.required]]
  });
  isEditRole = signal<boolean>(false);
  isSaving = signal<boolean>(false);

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions() {
    this.userService.getPermissions().subscribe({
      next: (perms) => this.permissions.set(perms.data.records)
    });
  }

  onLazyLoad(event: any) {
    this.first.set(event.first);
    this.rows.set(event.rows);
    if (event.sortField) {
      this.sortField.set(event.sortField);
      this.sortOrder.set(event.sortOrder);
    }
    this.loadRoles();
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.first.set(0);
    this.loadRoles();
  }

  loadRoles() {
    this.loading.set(true);
    const page = this.first() / this.rows();
    const sort = this.sortField() ? `${this.sortField()},${this.sortOrder() === 1 ? 'asc' : 'desc'}` : undefined;
    this.userService.getRoles(page, this.rows(), this.searchQuery() || undefined, sort).subscribe({
      next: (res) => {
        this.roles.set(res.data.records || []);
        this.totalRecords.set(res.data.totalRecords);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadData() {
    this.loadRoles();
  }

  openNewRole() {
    this.roleForm.reset();
    this.roleForm.patchValue({
      permissions: []
    });
    this.isEditRole.set(false);
    this.showRoleDialog.set(true);
  }

  editRole(role: Role) {
    this.roleForm.patchValue({
      id: role.id,
      name: role.name,
      permissions: role.permissions
    });
    this.isEditRole.set(true);
    this.showRoleDialog.set(true);
  }

  viewAllPermissions(role: Role) {
    this.selectedPermissions.set(role.permissions);
    this.selectedRoleName.set(role.name);
    this.showPermissionsDialog.set(true);
  }

  saveRole() {
    if (this.roleForm.valid) {
      this.isSaving.set(true);
      const roleData = this.roleForm.value;
      const rolePayload = {
        name: roleData.name,
        permissionIds: roleData.permissions.map((p: any) => p.id)
      };

      const action = this.isEditRole()
        ? this.userService.updateRole(roleData.id, rolePayload)
        : this.userService.createRole(rolePayload);

      action.pipe(finalize(() => this.isSaving.set(false))).subscribe({
        next: () => {
          this.loadData();
          if (this.isEditRole()) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Role Updated', life: 3000 });
          } else {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Role Created', life: 3000 });
          }
          this.showRoleDialog.set(false);
        },
        error: (err) => {
          if (err.status !== 403) {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Failed to save role' });
          }
        }
      });
    } else {
      this.roleForm.markAllAsTouched();
    }
  }
}
