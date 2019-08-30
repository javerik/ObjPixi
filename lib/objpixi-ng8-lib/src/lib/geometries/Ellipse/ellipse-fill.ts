import {Ellipse} from './ellipse';
import {EllipseInfo} from './ellipse-info';
import {GeometryType} from '../../interface/enums/geometry-type.enum';

export class EllipseFill extends Ellipse {

  constructor(ellipseInfo: EllipseInfo, name?: string) {
    if (ellipseInfo.style.fillStyle.useFill) {
      ellipseInfo.style.fillStyle.useFill = false;
    }
    super(ellipseInfo, name);
    this.Type = GeometryType.EllipseFill;
  }

}
