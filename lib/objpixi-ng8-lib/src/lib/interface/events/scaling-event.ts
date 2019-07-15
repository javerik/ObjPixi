import {ScaleDirection} from '../enums/scale-direction.enum';
import * as PIXI from 'pixi.js';

export interface ScalingEvent {
  direction: ScaleDirection;
  delta: PIXI.Point;
  ArrowPositions: Array<ScalingDelta>;
}

export interface ScalingDelta {
  dir: ScaleDirection;
  point: PIXI.Point;
}

