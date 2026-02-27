import {Component, computed} from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formly-radio-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RadioButtonModule, FormlyModule],
  template: `
    <div class="flex flex-col gap-3">
      @for (option of items(); track option) {
        <div class="flex items-center">
          <p-radioButton
            [name]="field.key?.toString()"
            [value]="option.value"
            [formControl]="formControl"
            [formlyAttributes]="field"
            [inputId]="field.id + '_' + option.value"
          ></p-radioButton>
          <label [for]="field.id + '_' + option.value" class="ml-2 cursor-pointer">
            {{ option.label }}
          </label>
        </div>
      }
    </div>
  `,
})
export class RadioGroupComponent extends FieldType<FieldTypeConfig> {
  items = computed(() => {
    const opts = this.props?.options;
    return Array.isArray(opts) ? opts : [];
  });
}
