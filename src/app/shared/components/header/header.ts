import {Component, inject, input} from '@angular/core';
import {NgClass} from '@angular/common';
import {Location} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NgClass
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private location = inject(Location);

  label = input('');
  styleClass = input('');
  showBackButton = input(false);

  back() {
    this.location.back();
  }
}
