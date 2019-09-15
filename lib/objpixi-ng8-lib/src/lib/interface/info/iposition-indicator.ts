import {Subject} from 'rxjs';
import * as PIXI from 'pixi.js';
import {PositionIndicatorInfo} from './position-indicator-info';

export interface IPositionIndicator {
  OnRequestRender: Subject<null>;
  OnInitialized: Subject<PIXI.DisplayObject>;
  Init(info?: PositionIndicatorInfo): void;
  Enable(state: boolean): void;
  OnEvent(event: PIXI.interaction.InteractionEvent);
  SetBorders(minX: number, maxX: number, minY: number, maxY): void;
}
