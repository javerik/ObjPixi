import * as PIXI from 'pixi.js';
import {PolyDrawerBase} from './poly-drawer-base';
import {PolyGon} from '../../../geometries/Poly/Polygon/poly-gon';

export class DrawerPolyGon extends PolyDrawerBase {

  Init() {
    this.object = new PolyGon({style: this.polyGonStyle, points: [new PIXI.Point()]});
    super.Init();
  }
}
