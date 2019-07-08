import {ScaleDirection} from '../enums/scale-direction.enum';
import * as PIXI from 'pixi.js';

export interface ScalingEvent {
  direction: ScaleDirection;
  delta: PIXI.Point;
}

export interface ScalingDelta {
  delta: PIXI.Point;
  direction: ScaleDirection;
}
