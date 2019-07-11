import * as PIXI from 'pixi.js';
import {IDrawer} from '../../../interface/draw/idrawer';
import {Subject} from 'rxjs';
import {Rect} from '../../../geometries/Rect/rect';
import {IStyleRect} from '../../../styles/istyle-rect';


export class DrawerRect implements IDrawer {

  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  private rect: Rect;
  private dragState = false;
  private startPoint: PIXI.Point;
  defaultLineColor = 0x009688;

  rectStyle: IStyleRect = {
    fillStyle: {
      useFill: true,
      useLine: true,
      fillAlpha: 0.5,
      lineAlpha: 1,
      fillColor: 0x8d6e63,
      lineColor: this.defaultLineColor,
      lineWidth: 2
    }
  };

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnInitialized = new Subject();
  }

  Init() {
    this.rect = new Rect({position: new PIXI.Point(), height: 0, width: 0, style: this.rectStyle, center: false});
    this.registerEvents();
    this.rect.Init();
  }

  OnEvent(event: PIXI.interaction.InteractionEvent) {
    if (event.type === 'pointerdown') {
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      const points = this.rect.GetPoints();
      points[0] = newPos;
      this.dragState = true;
      this.rect.UpdatePoints(points);
      this.startPoint = newPos;
    }

    if (event.type === 'pointermove') {
      if (!this.dragState) {
        return;
      }
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      const points = this.rect.GetPoints();
      points[1].x = newPos.x - this.startPoint.x;
      points[1].y = newPos.y - this.startPoint.y;
      this.rect.UpdatePoints(points);
    }
    if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
      this.dragState = false;
    }
  }

  private registerEvents() {
    this.rect.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    this.rect.OnInitialized.subscribe(value => {
      this.rect.EnableControls(false);
      this.OnInitialized.next(this.rect.GetObject());
    });
  }
}
