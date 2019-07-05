import {Subject} from 'rxjs';
import * as PIXI from 'pixi.js';

export class BaseGeo {

  public OnRequestRender: Subject<null>;
  public OnInitialized: Subject<PIXI.DisplayObject>;

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnInitialized = new Subject();
  }

}
