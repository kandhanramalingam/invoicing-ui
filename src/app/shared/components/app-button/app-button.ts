import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-button.html',
  styleUrl: './app-button.scss'
})
export class AppButton {
  label = input<string>('');
  icon = input<string>('');
  type = input<'button' | 'submit'>('button');
  outline = input<boolean>(false);
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  btnClass = input<string>('');

  // To handle PrimeNG-like severity
  severity = input<'primary' | 'secondary' | 'cancel' | 'danger' | 'success' | 'submit'>('primary');

  onClick = output<MouseEvent>();

  get buttonClass(): string {

    // Map PrimeNG severity to our types if provided

    let base = this.outline() ? `btn-${this.severity()}-outline` : `btn-${this.severity()}`;

    return `${base} flex gap-2 items-center justify-center ${this.btnClass()}`;
  }

  handleOnClick(event: MouseEvent) {
    if (!this.loading() && !this.disabled()) {
      event.stopPropagation();
      this.onClick.emit(event);
    }
  }
}
