import { inject, Injectable, signal } from '@angular/core';
import { SecuredStorage } from './secured-storage';
import { STORAGE_KEY } from '@shared/enums/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private storageService = inject(SecuredStorage);

  private _selectedCategory = signal<string>(this.getInitialCategory());
  selectedCategory = this._selectedCategory.asReadonly();

  private getInitialCategory(): string {
    const saved = this.storageService.retrieve<string>(STORAGE_KEY.SELECTED_CATEGORY);
    return saved || 'Wildlife';
  }

  setCategory(category: string) {
    this.storageService.store(STORAGE_KEY.SELECTED_CATEGORY, category);
    this._selectedCategory.set(category);
  }

  isWildlife(): boolean {
    return this._selectedCategory() === 'Wildlife';
  }
}
