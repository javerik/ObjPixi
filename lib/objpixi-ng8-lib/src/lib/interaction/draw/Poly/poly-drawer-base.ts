import * as PIXI from 'pixi.js';
import {IDrawer} from '../../../interface/draw/idrawer';
import {IStylePoly} from '../../../styles/istyle-poly';
import {Subject} from 'rxjs';
import {PolyGon} from '../../../geometries/Poly/Polygon/poly-gon';
import {PolyLine} from '../../../geometries/Poly/Polyline/poly-line';
import {Point} from '../../../geometries/Point/point';
import {IGeometry} from '../../../interface/igeometry';

export class PolyDrawerBase implements IDrawer {

  // region IDrawer Member
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  // endregion

  // region Style
  protected dragPointFillColor = 0xf44336;
  protected defaultLineColor = 0x009688;
  protected polyLineStyle: IStylePoly = {
    pointStyle: {
      radius: 6,
      fillStyle: {
        useFill: true,
        useLine: false,
        fillAlpha: 1,
        fillColor: this.dragPointFillColor
      }
    },
    fillStyle: {
      useLine: true,
      useFill: false,
      lineWidth: 2,
      lineColor: this.defaultLineColor,
      lineAlpha: 1
    }
  };
  protected polyGonStyle: IStylePoly = {
    pointStyle: {
      radius: 6,
      fillStyle: {
        useFill: true,
        useLine: false,
        fillAlpha: 1,
        fillColor: this.dragPointFillColor
      }
    },
    fillStyle: {
      useLine: false,
      useFill: true,
      fillColor: 0x66bb6a,
      fillAlpha: 0.5
    }
  };
  // endregion

  // region Member
  protected points: Array<PIXI.Point>;
  protected firstPoint: Point;
  protected lastPoint: Point;
  protected container: PIXI.Container;
  protected object: PolyGon | PolyLine;
  // endregion

  constructor() {
    this.OnInitialized = new Subject();
    this.OnRequestRender = new Subject();
    this.points = new Array<PIXI.Point>();
    this.container = new PIXI.Container();
    this.firstPoint = new Point({position: new PIXI.Point(-100, -100)});
    this.lastPoint = new Point({position: new PIXI.Point(-100, -100)});
    this.registerPointEvents();
    this.firstPoint.Init();
    this.lastPoint.Init();
  }

  // region Events
  private registerPointEvents() {
    const ar = [this.firstPoint, this.lastPoint];
    for (const p of ar) {
      p.OnInitialized.subscribe(value => {
        this.container.addChild(value);
        this.firstPoint.EnableControls(false);
      });
      p.OnRequestRender.subscribe(() => {
        this.OnRequestRender.next();
      });
      p.OnInteraction.subscribe(() => {
      });
    }
  }
  private registerEvents() {
    this.object.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    this.object.OnInitialized.subscribe(value => {
      this.object.EnableControls(false);
      this.container.addChild(value);
      this.container.setChildIndex(value, 0);
      this.OnInitialized.next(this.container);
    });
  }
  // endregion

  protected setPoints() {
    this.firstPoint.UpdatePoints([this.points[0]]);
    if (this.points.length > 1) {
      this.lastPoint.UpdatePoints([this.points[this.points.length - 1]]);
    }
  }

  // region IDrawer
  Init() {
    this.registerEvents();
    this.object.Init();
  }

  OnEvent(event: PIXI.interaction.InteractionEvent) {
    if (event.type === 'click' || event.type === 'tap') {
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      this.points.push(newPos);
      this.setPoints();
      this.object.UpdatePoints(this.points);
    }
    if (event.type === ' rightclick') {
      this.points.pop();
      this.object.UpdatePoints(this.points);
    }
  }
  IsValid(): boolean {
    return this.points.length > 2;
  }
  GetGeometry(): IGeometry {
    return this.object;
  }
  // endregion
}
