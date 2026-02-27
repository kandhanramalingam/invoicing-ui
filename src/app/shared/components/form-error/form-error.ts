import {Component, input} from '@angular/core';
import {AbstractControl} from "@angular/forms";

@Component({
  selector: 'app-form-error',
  imports: [],
  templateUrl: './form-error.html',
  styleUrl: './form-error.scss',
})
export class FormError {
    messages = input.required<{[key: string]: string}>();
    formSubmitted = input.required<boolean>();
    control = input.required<AbstractControl | null>();

    get errors() {
        return Object.keys(this.messages());
    }
}
