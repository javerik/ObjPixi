import {Rect} from './rect';
import {RectInfo} from './rect-info';
import {GeometryType} from '../../interface/enums/geometry-type.enum';

export class RectFill extends Rect {

  constructor(info: RectInfo, name?: string) {
    super(info, name);
    this.Type = GeometryType.RectFill;
  }
}
