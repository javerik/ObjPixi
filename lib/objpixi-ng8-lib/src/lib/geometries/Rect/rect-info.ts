import * as PIXI from 'pixi.js';
import {IStyleRect} from '../../styles/istyle-rect';

export interface RectInfo {
  width: number;
  height: number;
  center: boolean;
  position: PIXI.Point;
  style: IStyleRect;
}
