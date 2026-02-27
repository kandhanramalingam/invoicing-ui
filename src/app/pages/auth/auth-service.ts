import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environments} from '@env/environment';
import {ResponseDto} from '@shared/interfaces/api.interface';
import {LoginData, LoginResponseValue} from '@shared/interceptors/login';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseUrl: string = environments.baseURL;
    constructor(private http: HttpClient) {}

    login(data: LoginData) {
        return this.http.post<ResponseDto<LoginResponseValue>>(`${this.baseUrl}/auth/login`, data);
    }
}
