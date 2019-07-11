import * as PIXI from 'pixi.js';
import {IGeometry} from '../igeometry';

export interface ChangeEvent {
  sender: IGeometry;
  points: Array<PIXI.Point>;
}
