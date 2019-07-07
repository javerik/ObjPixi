import {ScaleDirection} from '../enums/scale-direction.enum';
import * as PIXI from 'pixi.js';

export interface ScalingEvent {
  direction: ScaleDirection;
  deltas: Array<ScalingDelta>;
}

export interface ScalingDelta {
  delta: PIXI.Point;
  direction: ScaleDirection;
}
