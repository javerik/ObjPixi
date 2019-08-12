import {Subject} from 'rxjs';
import * as PIXI from 'pixi.js';
import {IGeometry} from '../igeometry';


export interface IDrawer {
  OnRequestRender: Subject<null>;
  OnInitialized: Subject<PIXI.DisplayObject>;
  Init();
  OnEvent(event: PIXI.interaction.InteractionEvent);

  /**
   *
   * @return true if points for geometry is valid
   */
  IsValid(): boolean;
  GetGeometry(): IGeometry;
}
