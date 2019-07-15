import * as PIXI from 'pixi.js';


export interface PositionIndicatorInfo {
  position?: PIXI.Point;
  lockPosition: boolean;
  offsets?: PIXI.Point;
  moveBox: boolean;
}
