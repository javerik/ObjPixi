import * as PIXI from 'pixi.js';
import {IScaler} from './iscaler';
import {Subject} from 'rxjs';
import {GeoEvent} from '../geometries/base-geo';


export interface IGeometry {
  Scaler: IScaler;
  OnRequestRender: Subject<null>;
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnInteraction: Subject<GeoEvent>;
  Init(): void;
  GetPoints(): Array<PIXI.Point>;
  UpdatePoints(points: Array<PIXI.Point>);
  EnableControls(state: boolean);
  GetId(): string;
  GetName(): string;
  SetName(name: string);
  GetObject(): PIXI.DisplayObject;
  ClearSelection(): void;
}
