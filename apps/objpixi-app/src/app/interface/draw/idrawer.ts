import {Subject} from 'rxjs';
import {IGeometry} from '../igeometry';
import * as PIXI from 'pixi.js';


export interface IDrawer {
  OnRequestRender: Subject<null>;
  OnInitialized: Subject<IGeometry>;
  Init();
  OnEvent(event: PIXI.interaction.InteractionEvent);
}
