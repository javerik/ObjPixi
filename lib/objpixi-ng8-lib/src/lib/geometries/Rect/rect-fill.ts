import {Rect} from './rect';
import {RectInfo} from './rect-info';
import {GeometryType} from '../../interface/enums/geometry-type.enum';

export class RectFill extends Rect {

  constructor(info: RectInfo, name?: string) {
    if (info.style.fillStyle.useFill) {
      info.style.fillStyle.useFill = false;
    }
    super(info, name);
    this.Type = GeometryType.RectFill;
  }
}
