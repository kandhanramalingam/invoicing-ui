import {Component, input} from '@angular/core';
import {Tag} from 'primeng/tag';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-tag-list',
  imports: [
    Tag,
    Dialog
  ],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.scss',
})
export class TagList {
  labels = input<string[]>([]);
  size = input<number>(3);
  header = input<string>('View All');
  showDialog = false;

  viewAll() {
    this.showDialog = true;
  }
}
