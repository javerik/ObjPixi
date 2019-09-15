import * as PIXI from 'pixi.js';
import {IStyleEllipse} from '../../styles/istyle-ellipse';
import {ICommonCoords} from '../../interface/info/icommon-coords';

export interface EllipseInfo {
  coords: ICommonCoords;
  style: IStyleEllipse;
}
