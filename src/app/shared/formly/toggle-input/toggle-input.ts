import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formly-toggle-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToggleSwitchModule, FormlyModule],
  template: `
    <div class="flex flex-col gap-1">
      <label *ngIf="props.label" class="text-sm font-medium text-gray-700">
        {{ props.label }}
      </label>
      <div class="flex items-center gap-2">
        <p-toggleSwitch
          [formControl]="formControl"
          [formlyAttributes]="field"
        ></p-toggleSwitch>
        <span class="text-sm whitespace-nowrap">{{ props['toggleLabel'] || (formControl.value ? 'Percent' : 'Value') }}</span>
      </div>
    </div>
  `,
})
export class ToggleInputComponent extends FieldType<FieldTypeConfig> {}
