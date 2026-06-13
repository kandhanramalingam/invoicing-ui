import { Component, inject, OnInit } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '@pages/auth/auth-service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '@shared/service/category.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    SelectModule,
    FormsModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private categoryService = inject(CategoryService);

  selectedCategory: string = 'Wildlife';
  categories = [
    { label: 'Wildlife', value: 'Wildlife', disabled: false },
    { label: 'Live Stock', value: 'Live Stock', disabled: true }
  ];

  ngOnInit() {
    this.selectedCategory = this.categoryService.selectedCategory();
  }

  onCategoryChange(event: any) {
    this.categoryService.setCategory(event.value);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
