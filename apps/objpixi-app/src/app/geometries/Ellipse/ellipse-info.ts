import * as PIXI from 'pixi.js';
import {IStyleEllipse} from '../../styles/istyle-ellipse';

export interface EllipseInfo {
  width: number;
  height: number;
  center: boolean;
  position: PIXI.Point;
  style: IStyleEllipse;
}
