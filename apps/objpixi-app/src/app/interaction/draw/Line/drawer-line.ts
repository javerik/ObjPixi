import {IDrawer} from '../../../interface/draw/idrawer';
import {Subject} from 'rxjs';
import {IGeometry} from '../../../interface/igeometry';
import {Line} from '../../../geometries/Line/line';
import {IStyleLine} from '../../../styles/istyle-line';
import * as PIXI from 'pixi.js';


export class DrawerLine implements IDrawer {
  OnInitialized: Subject<IGeometry>;
  OnRequestRender: Subject<null>;
  private line: Line;
  private dragState = false;
  dragPointFillColor = 0xf44336;
  defaultLineColor = 0x009688;
  lineStyle: IStyleLine = {
    alpha: 1,
    color: this.defaultLineColor,
    lineWidth: 3,
    pointStyle: {
      fillStyle: {
        useFill: true,
        useLine: false,
        fillAlpha: 1,
        fillColor: this.dragPointFillColor
      },
      radius: 6
    }
  };

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnInitialized = new Subject();
  }

  Init() {
    this.line = new Line({
      style: this.lineStyle,
      p1: new PIXI.Point(),
      p2: new PIXI.Point()
    });
    this.registerEvents();
    this.line.Init();
  }

  OnEvent(event: PIXI.interaction.InteractionEvent) {
    if (event.type === 'pointerdown') {
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      const points = this.line.GetPoints();
      points[0] = newPos;
      this.dragState = true;
      this.line.UpdatePoints(points);
    }
    if (event.type === 'pointermove') {
      if (!this.dragState) {
        return;
      }
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      const points = this.line.GetPoints();
      points[1] = newPos;
      this.line.UpdatePoints(points);
    }
    if (event.type === 'pointerup' || event.type === 'pointerupoutside') {
      this.dragState = false;
    }
  }

  private registerEvents() {
    this.line.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    this.line.OnInitialized.subscribe(value => {
      this.line.EnableControls(false);
      this.OnInitialized.next(this.line);
    });
  }
}
