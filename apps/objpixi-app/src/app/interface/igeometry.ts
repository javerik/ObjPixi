import * as PIXI from 'pixi.js';
import {IScaler} from './iscaler';
import {Subject} from 'rxjs';
import {GeoEvent} from '../geometries/base-geo';
import {ChangeEvent} from './events/change-event';


export interface IGeometry {
  Scaler: IScaler;
  OnRequestRender: Subject<null>;
  OnChange: Subject<ChangeEvent>;
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnInteraction: Subject<GeoEvent>;
  Init(): void;
  ContainsPoint(point: PIXI.Point): boolean;
  GetPoints(): Array<PIXI.Point>;
  UpdatePoints(points: Array<PIXI.Point>);
  EnableControls(state: boolean);
  GetId(): string;
  GetName(): string;
  SetName(name: string);
  GetObject(): PIXI.DisplayObject;
  ClearSelection(): void;
}
