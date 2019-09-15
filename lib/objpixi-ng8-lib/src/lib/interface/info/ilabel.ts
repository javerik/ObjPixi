import * as PIXI from 'pixi.js';
import {Subject} from 'rxjs';
import {IStyleLabel} from '../../styles/istyle-label';


export interface ILabel {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  SetStyle(style: IStyleLabel);
  GetStyle(): IStyleLabel;
  SetText(text: string);
  SetOffsets(point: PIXI.Point);
  GetOffsets(): PIXI.Point;
  SetOriginPosition(point: PIXI.Point);
  EnableControls(state: boolean): void;
  ClearSelection();
  SetVisible(state: boolean): void;
  Init(name?: string, style?: IStyleLabel): void;
}
