import {Component, inject, signal} from '@angular/core';
import {InputText} from "primeng/inputtext";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "@pages/auth/auth-service";
import {ProgressSpinner} from "primeng/progressspinner";
import {MenuItem, MessageService} from "primeng/api";
import {Toast} from "primeng/toast";
import {Breadcrumb} from "primeng/breadcrumb";
import {FormError} from '@shared/components/form-error/form-error';
import {SecuredStorage} from '@shared/service/secured-storage';
import {STORAGE_KEY} from '@shared/enums/storage-keys';
import {JwtService} from '@shared/service/jwt.service';

@Component({
  selector: 'app-login',
  imports: [
    InputText,
    ReactiveFormsModule,
    ProgressSpinner,
    Toast,
    Breadcrumb,
    FormError
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loading = signal<boolean>(false);
  loginForm: FormGroup;
  formSubmitted = false;
  apiAuthService = inject(AuthService);
  jwtService = inject(JwtService);
  messageService = inject(MessageService);
  items = signal<MenuItem[]>([]);
  home: MenuItem = {icon: 'fa fa-home', routerLink: '/'};
  storage = inject(SecuredStorage);
  route = inject(Router);

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('superadmin@admin.com', [Validators.required]),
      password: new FormControl('password', [Validators.required]),
    });
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading.set(true);
    this.apiAuthService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.storage.store(STORAGE_KEY.TOKEN, response.data.token);
        this.jwtService.loadPermissions();
        this.loading.set(false);
        this.route.navigate(['/admin']);
      },
      error: error => {
        const msg = error.error ? error.error.message : error.message;
        this.messageService.add({severity: 'error', summary: 'Alert', detail: msg});
        console.log(error.message);
        this.loading.set(false);
      }
    })
  }
}
