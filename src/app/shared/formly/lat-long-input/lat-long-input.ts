import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formly-lat-long-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, FormlyModule],
  template: `
    <div class="flex gap-2 w-full items-center">
      <div class="relative flex-1">
        <input
          type="text"
          pInputText
          [formControl]="latControl"
          class="w-full pl-9"
          placeholder="Lat"
          (input)="updateCombinedValue()"
        />
      </div>
      <div class="relative flex-1">
        <input
          type="text"
          pInputText
          [formControl]="longControl"
          class="w-full"
          placeholder="Long"
          (input)="updateCombinedValue()"
        />
      </div>
    </div>
  `,
})
export class LatLongInputComponent extends FieldType<FieldTypeConfig> implements OnInit {
  latControl = new FormControl('');
  longControl = new FormControl('');

  ngOnInit() {
    if (this.formControl.value) {
      const [lat, long] = this.formControl.value.split(',').map((v: string) => v.trim());
      this.latControl.setValue(lat || '');
      this.longControl.setValue(long || '');
    }

    this.formControl.valueChanges.subscribe(value => {
      if (value) {
        const [lat, long] = value.split(',').map((v: string) => v.trim());
        if (lat !== this.latControl.value || long !== this.longControl.value) {
          this.latControl.setValue(lat || '', { emitEvent: false });
          this.longControl.setValue(long || '', { emitEvent: false });
        }
      } else {
        this.latControl.setValue('', { emitEvent: false });
        this.longControl.setValue('', { emitEvent: false });
      }
    });
  }

  updateCombinedValue() {
    const lat = this.latControl.value || '';
    const long = this.longControl.value || '';
    if (lat || long) {
      this.formControl.setValue(`${lat}, ${long}`);
    } else {
      this.formControl.setValue('');
    }
  }
}
