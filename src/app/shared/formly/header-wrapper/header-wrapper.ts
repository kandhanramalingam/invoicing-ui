import {Component, input} from '@angular/core';
import {FieldWrapper} from '@ngx-formly/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-header-wrapper',
  imports: [
    NgClass
  ],
  templateUrl: './header-wrapper.html',
  styleUrl: './header-wrapper.scss',
})
export class HeaderWrapper extends FieldWrapper {
}
