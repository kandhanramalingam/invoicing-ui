import { inject, Injectable, signal } from '@angular/core';
import { SecuredStorage } from './secured-storage';
import {STORAGE_KEY} from '@shared/enums/storage-keys';

export interface DecodedToken {
  sub: string;
  fullName: string;
  permissions: string[];
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private storage = inject(SecuredStorage);

  private permissionsSignal = signal<string[]>([]);
  readonly permissions = this.permissionsSignal.asReadonly();

  constructor() {
    this.loadPermissions();
  }

  loadPermissions() {
    const token = this.storage.retrieve<string>(STORAGE_KEY.TOKEN);
    if (token) {
      try {
        const decoded = this.decodeToken(token);
        this.permissionsSignal.set(decoded.permissions || []);
      } catch (e) {
        console.error('Error decoding token', e);
        this.permissionsSignal.set([]);
      }
    } else {
      this.permissionsSignal.set([]);
    }
  }

  private decodeToken(token: string): DecodedToken {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token');
    }
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  }

  hasPermission(permission: string): boolean {
    return this.permissionsSignal().includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => this.permissionsSignal().includes(p));
  }
}
