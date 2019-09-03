import * as PIXI from 'pixi.js';
import {Subject} from 'rxjs';


export interface ILabel {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  SetOffsets(point: PIXI.Point);
  GetOffsets(): PIXI.Point;
  SetOriginPosition(point: PIXI.Point);
  EnableControls(state: boolean): void;
  ClearSelection();
  SetVisible(state: boolean): void;
  SetText(text: string);
  Init(name?: string): void;
}
