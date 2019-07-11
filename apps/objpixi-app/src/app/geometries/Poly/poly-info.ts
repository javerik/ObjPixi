import * as PIXI from 'pixi.js';
import {IStylePoly} from '../../styles/istyle-poly';


export interface PolyInfo {
  points: Array<PIXI.Point>;
  style: IStylePoly;
}
