import { Component } from '@angular/core';
import {FieldWrapper} from '@ngx-formly/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-key-value-wrapper',
  imports: [CommonModule],
  templateUrl: './key-value-wrapper.html',
  styleUrl: './key-value-wrapper.scss',
})
export class KeyValueWrapper extends FieldWrapper {

}
