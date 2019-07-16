import * as PIXI from 'pixi.js';
import {PolyDrawerBase} from './poly-drawer-base';
import {PolyLine} from '../../../geometries/Poly/Polyline/poly-line';

export class DrawerPolyLine extends PolyDrawerBase {


  Init() {
    this.object = new PolyLine({style: this.polyLineStyle, points: [new PIXI.Point()]});
    super.Init();
  }
}
