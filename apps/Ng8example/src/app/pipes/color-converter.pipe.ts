import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'colorConverter'
})
export class ColorConverterPipe implements PipeTransform {

  transform(value: string | number, ...args: any[]): any {
    if (typeof value === 'string') {
      this.cleanString(value);
      return parseInt(value);
    } else if (typeof value === 'number') {
      return value.toString(16);
    } else {
      return null;
    }
  }

  private cleanString(str: string) {
    if (str.indexOf('0x') > -1 || str.indexOf('0X') > -1 || str.indexOf('x') > -1) {
      str = str.replace('0x', '').replace('0X', '').replace('x', '');
    }
  }


}
