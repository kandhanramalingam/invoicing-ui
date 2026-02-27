import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formly-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePickerModule, FormlyModule],
  template: `
    <p-datePicker
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="props.placeholder || ''"
      [dateFormat]="props['dateFormat'] || 'dd/mm/yy'"
      [showIcon]="props['showIcon'] !== false"
      [showButtonBar]="props['showButtonBar']"
      [fluid]="true"
      appendTo="body"
    ></p-datePicker>
  `,
})
export class DatePickerComponent extends FieldType<FieldTypeConfig> {}
