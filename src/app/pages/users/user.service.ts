import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environments } from '../../../environments/environment';
import { ResponseDto, PaginatedDetailsDto } from '@shared/interfaces/api.interface';
import { User, Role, Permission } from '@shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environments.baseURL}`;

  // User Endpoints
  getUsers(page: number = 0, size: number = 10, search?: string, sort?: string): Observable<PaginatedDetailsDto<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);

    return this.http.get<ResponseDto<PaginatedDetailsDto<User>>>(`${this.API_URL}/users`, { params })
      .pipe(map(res => res.data));
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<ResponseDto<User>>(`${this.API_URL}/users`, user)
      .pipe(map(res => res.data));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<ResponseDto<User>>(`${this.API_URL}/users/${id}`, user)
      .pipe(map(res => res.data));
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.API_URL}/users/${id}`)
      .pipe(map(() => void 0));
  }

  // Role Endpoints
  getRoles(page?: number, size?: number, search?: string, sort?: string): Observable<ResponseDto<PaginatedDetailsDto<Role>>> {
    let params = new HttpParams();
    const pageV = page?.toString() || '0';
    const sizeV = size?.toString() || '0';
    params = params.set('page', pageV).set('size', sizeV);
    if (search) params = params.set('search', search);
    if (sort) params = params.set('sort', sort);
    return this.http.get<ResponseDto<PaginatedDetailsDto<Role>>>(`${this.API_URL}/roles`, { params });
  }

  createRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<ResponseDto<Role>>(`${this.API_URL}/roles`, role)
      .pipe(map(res => res.data));
  }

  updateRole(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.put<ResponseDto<Role>>(`${this.API_URL}/roles/${id}`, role)
      .pipe(map(res => res.data));
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<ResponseDto<void>>(`${this.API_URL}/roles/${id}`)
      .pipe(map(() => void 0));
  }

  // Permission Endpoints
  getPermissions(): Observable<ResponseDto<PaginatedDetailsDto<Permission>>> {
    return this.http.get<ResponseDto<PaginatedDetailsDto<Permission>>>(`${this.API_URL}/permissions`);
  }
}
