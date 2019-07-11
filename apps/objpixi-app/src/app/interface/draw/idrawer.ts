import {Subject} from 'rxjs';
import * as PIXI from 'pixi.js';


export interface IDrawer {
  OnRequestRender: Subject<null>;
  OnInitialized: Subject<PIXI.DisplayObject>;
  Init();
  OnEvent(event: PIXI.interaction.InteractionEvent);
}
