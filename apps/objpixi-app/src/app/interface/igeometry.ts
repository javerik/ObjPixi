import * as PIXI from 'pixi.js';
import {IScaler} from './iscaler';
import {Subject} from 'rxjs';


export interface IGeometry {
  Scaler: IScaler;
  OnRequestRender: Subject<null>;
  Init(): void;
  GetId(): string;
  GetName(): string;
  SetName(name: string);
  GetObject(): PIXI.DisplayObject;
  ClearSelection(): void;
}
