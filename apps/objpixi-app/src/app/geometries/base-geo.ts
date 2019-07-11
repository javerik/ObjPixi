import {Subject} from 'rxjs';
import * as PIXI from 'pixi.js';
import {IGeometry} from '../interface/igeometry';
import { UUID } from 'angular2-uuid';
import {ChangeEvent} from '../interface/events/change-event';

export class BaseGeo {

  public OnRequestRender: Subject<null>;
  public OnInitialized: Subject<PIXI.DisplayObject>;
  public OnInteraction: Subject<GeoEvent>;
  public OnChange: Subject<ChangeEvent>;
  protected Id: string;
  protected Name: string;
  protected GContainer: PIXI.Container;
  protected enableControl = true;

  constructor(name?: string) {
    this.Id = UUID.UUID();
    if (name === undefined) {
      this.Name = '';
    } else {
      this.Name = name;
    }
    this.OnRequestRender = new Subject();
    this.OnInitialized = new Subject();
    this.OnInteraction = new Subject();
    this.OnChange = new Subject();
  }

}

export interface GeoEvent {
  target: IGeometry;
  event: PIXI.interaction.InteractionEvent;
}
