import { Component } from '@angular/core';
import {FormError} from "../../../shared/components/form-error/form-error";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Breadcrumb} from "primeng/breadcrumb";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-forgot-password',
    imports: [
        FormError,
        FormsModule,
        InputText,
        ReactiveFormsModule,
        Breadcrumb
    ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
    loginForm: FormGroup;
    formSubmitted = false;
    items: MenuItem[] = [{ label: 'Login', routerLink: '/login' }, { label: 'Forgot Password' }];
    home: MenuItem = { icon: 'fa fa-home', routerLink: '/' };

    get email() { return this.loginForm.get('email'); }
    get password() { return this.loginForm.get('password'); }

    constructor() {
        this.loginForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required]),
        });
    }

    login() {
        this.formSubmitted = true;
    }
}
