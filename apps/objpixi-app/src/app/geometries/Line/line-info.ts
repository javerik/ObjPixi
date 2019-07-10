import * as PIXI from 'pixi.js';
import {IStyleLine} from '../../styles/istyle-line';


export interface LineInfo {
  p1: PIXI.Point;
  p2: PIXI.Point;
  style: IStyleLine;
}
