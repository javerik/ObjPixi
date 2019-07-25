import * as PIXI from 'pixi.js';
import {IStyleRect} from '../../styles/istyle-rect';
import {ICommonCoords} from '../../interface/info/icommon-coords';

export interface RectInfo {
  coords: ICommonCoords;
  style: IStyleRect;
}
