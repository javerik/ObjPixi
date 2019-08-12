import * as PIXI from 'pixi.js';
import {IDrawer} from '../../../interface/draw/idrawer';
import {Subject} from 'rxjs';
import {IStyleEllipse} from '../../../styles/istyle-ellipse';
import {Ellipse} from '../../../geometries/Ellipse/ellipse';
import {EllipseInfo} from '../../../geometries/Ellipse/ellipse-info';
import {IGeometry} from '../../../interface/igeometry';

export class DrawerEllipse implements IDrawer {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  defaultLineColor = 0x009688;
  ellipseStyle: IStyleEllipse = {
    fillStyle: {
      useFill: true,
      useLine: true,
      fillAlpha: 0.5,
      lineAlpha: 1,
      fillColor: 0x7e57c2,
      lineColor: this.defaultLineColor,
      lineWidth: 2
    }
  };
  private startPoint: PIXI.Point;
  private ellipse: Ellipse;
  private dragState = false;

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnInitialized = new Subject();
  }

  // region IDrawer

  Init() {
    const info: EllipseInfo = {
      coords: {position: new PIXI.Point(),
        width: 0, height: 0, center: true},
      style: this.ellipseStyle
    };
    this.ellipse = new Ellipse(info);
    this.registerEvents();
    this.ellipse.Init();
  }

  OnEvent(event: PIXI.interaction.InteractionEvent) {
    if (event.type === 'pointerdown') {
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      const points = this.ellipse.GetPoints();
      points[0] = newPos;
      this.dragState = true;
      this.ellipse.UpdatePoints(points);
      this.startPoint = newPos;
    }

    if (event.type === 'pointermove') {
      if (!this.dragState) {
        return;
      }
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      const points = this.ellipse.GetPoints();
      points[1].x = (newPos.x - this.startPoint.x) * 2;
      points[1].y = (newPos.y - this.startPoint.y) * 2;
      this.ellipse.UpdatePoints(points);
    }
    if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
      this.dragState = false;
    }
  }

  IsValid(): boolean {
    return !(this.ellipse.GetPoints()[1].x === 0 || this.ellipse.GetPoints()[1].y === 0);
  }

  GetGeometry(): IGeometry {
    return this.ellipse;
  }
  // endregion
  // region events

  private registerEvents() {
    this.ellipse.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    this.ellipse.OnInitialized.subscribe(value => {
      this.ellipse.EnableControls(false);
      this.OnInitialized.next(value);
    });
  }

  // endregion
}
