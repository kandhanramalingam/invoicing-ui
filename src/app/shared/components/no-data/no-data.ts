import {Component, input} from '@angular/core';

@Component({
  selector: 'app-no-data',
  imports: [],
  templateUrl: './no-data.html',
  styleUrl: './no-data.scss',
})
export class NoData {
  message = input('No data');
}
