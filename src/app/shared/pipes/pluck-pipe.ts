import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluck',
})
export class PluckPipe implements PipeTransform {

  transform(value: {[key: string]: any}[], key: string): any[] {
    try {
      return value.map(item => item[key]);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

}
