import * as PIXI from 'pixi.js';
import {IScaler} from './iscaler';
import {Subject} from 'rxjs';
import {GeoEvent} from '../geometries/base-geo';
import {ChangeEvent} from './events/change-event';
import {ILabel} from './info/ilabel';
import {ITexId} from './itex-id';


export interface IGeometry {
  Scaler: IScaler;
  OnRequestRender: Subject<null>;
  OnChange: Subject<ChangeEvent>;
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnInteraction: Subject<GeoEvent>;
  Init(): void;
  SetLabel(label: ILabel): void;
  ContainsPoint(point: PIXI.Point): boolean;
  UpdatePoints(points: Array<PIXI.Point>);
  EnableControls(state: boolean);
  GetObject(): PIXI.DisplayObject;
  GetPoints(): Array<PIXI.Point>;
  GetId(): string;
  GetName(): string;
  SetName(name: string);
  SetSelection();
  ClearSelection(): void;
}
