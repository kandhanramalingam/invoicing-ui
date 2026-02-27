import { Component, input, output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './search-input.html',
})
export class SearchInput implements OnInit, OnDestroy {
  placeholder = input<string>('Search...');
  debounceTime = input<number>(400);
  searchChange = output<string>();

  searchValue = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(this.debounceTime()),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => this.searchChange.emit(value));
  }

  onInput(value: string) {
    this.searchSubject.next(value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
