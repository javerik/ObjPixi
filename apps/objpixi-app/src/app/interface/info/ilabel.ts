import * as PIXI from 'pixi.js';
import {Subject} from 'rxjs';


export interface ILabel {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  EnableControls(state: boolean): void;
  SetVisible(state: boolean): void;
  SetText(text: string);
  Init(): void;
}
