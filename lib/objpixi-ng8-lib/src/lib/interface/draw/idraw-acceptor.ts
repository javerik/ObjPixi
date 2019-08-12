import {Subject} from 'rxjs';
import * as PIXI from 'pixi.js';
import {GeometryType} from '../enums/geometry-type.enum';


export interface IDrawAcceptor {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<any>;
  /***
   * Event which gets triggered when user accepts or cancels current Geometry
   */
  OnAccepted: Subject<boolean>;

  /***
   * If true, geometry is valid and can be accepted
   * @param valid
   * @constructor
   */
  SetValidState(valid: boolean): void;

  /***
   * Sets the geometry type and resets valid state to false
   * @param geo
   * @constructor
   */
  SetGeometry(geo: GeometryType): void;
}
