import * as PIXI from 'pixi.js';
import {IScaler} from './iscaler';
import {Subject} from 'rxjs';
import {GeoEvent} from '../geometries/base-geo';
import {ChangeEvent} from './events/change-event';
import {ILabel} from './info/ilabel';
import {GeometryType} from './enums/geometry-type.enum';


export interface IGeometry {
  // Generic scaling interface
  Scaler: IScaler;
  // Hole stage is getting rerendered
  OnRequestRender: Subject<null>;
  // Interaction Events / Object modification events
  OnChange: Subject<ChangeEvent>;
  OnInteraction: Subject<GeoEvent>;
  //gets Fired when initialization is done, so object can be added to stage
  OnInitialized: Subject<PIXI.DisplayObject>;

  Init(): void;
  // region modification
  SetLabel(label: ILabel): void;
  GetStyle(): any;
  SetStyle(style: any);
  // endregion
  // region point operations
  ContainsPoint(point: PIXI.Point): boolean;
  UpdatePoints(points: Array<PIXI.Point>);
  // endregion
  // region Ctrl operations
  /***
   * Enables / Disables interactions with object such as scaling or moving
   * @param state
   */
  EnableControls(state: boolean);
  /***
   * Hides all interaction objects related to this geo
   */
  ClearSelection(): void;
  // endregion
  // region Meta info
  GetObject(): PIXI.DisplayObject;
  GetPoints(): Array<PIXI.Point>;
  GetId(): string;
  GetType(): GeometryType;
  GetLabel(): ILabel;
  GetName(): string;
  SetName(name: string);
  SetSelection();
  // endregion
}
