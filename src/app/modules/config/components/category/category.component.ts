import { Component } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  newCategory = '';
  categories: string[] = [];

  addCategory() {
    const trimmed = this.newCategory.trim();
    if (trimmed) {
      this.categories.push(trimmed);
      this.newCategory = '';
    }
  }
}
