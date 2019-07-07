import * as PIXI from 'pixi.js';
import {Subject} from 'rxjs';
import {ScalingEvent} from './events/scaling-event';


export interface IScaler {
  OnScaleEvent: Subject<ScalingEvent>;
  Generate(info: ScalerInfo);
  SetVisibility(visible: boolean);
}

export interface ScalerInfo {
  obj: PIXI.DisplayObject;
  offset: number;
}
