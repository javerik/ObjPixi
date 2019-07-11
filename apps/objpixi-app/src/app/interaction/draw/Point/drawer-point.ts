import {IDrawer} from '../../../interface/draw/idrawer';
import {Subject} from 'rxjs';
import {Point} from '../../../geometries/Point/point';
import * as PIXI from 'pixi.js';


export class DrawerPoint implements IDrawer {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  private point: Point;

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnInitialized = new Subject();
  }

  Init() {
    this.point = new Point({position: new PIXI.Point(0, 0)});
    this.registerEvents();
    this.point.Init();
  }

  OnEvent(event: PIXI.interaction.InteractionEvent) {
    if (event.type === 'click' || event.type === 'tap') {
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      this.point.UpdatePoints([newPos]);
    }
  }

  private registerEvents() {
    this.point.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    this.point.OnInitialized.subscribe(value => {
      this.point.EnableControls(false);
      this.OnInitialized.next();
    });
  }

}
