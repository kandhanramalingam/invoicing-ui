import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formly-rating',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule],
  template: `
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between border rounded-md bg-white overflow-hidden">
        @for (item of items; track item) {
          <div class="flex-1 flex justify-center items-center border-r last:border-r-0 h-12 cursor-pointer transition-colors hover:bg-green-200"
               [class.bg-blue-200]="formControl.value === item"
               [class.text-blue-600]="formControl.value === item"
               [class.font-bold]="formControl.value === item"
               (click)="formControl.setValue(item)">
            {{ item }}
          </div>
        }
      </div>
      <div class="flex justify-between text-sm text-gray-500 px-1">
        <span>{{ props['labelLeft'] || 'Not at all likely' }}</span>
        <span>{{ props['labelRight'] || 'Extremely likely' }}</span>
      </div>
    </div>
  `,
})
export class RatingComponent extends FieldType<FieldTypeConfig> {
  items = [0,1,2,3,4,5,6,7,8,9,10];
}
