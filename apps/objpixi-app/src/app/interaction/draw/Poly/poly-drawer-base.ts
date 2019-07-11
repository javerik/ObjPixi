import * as PIXI from 'pixi.js';
import {IDrawer} from '../../../interface/draw/idrawer';
import {IStylePoly} from '../../../styles/istyle-poly';
import {Subject} from 'rxjs';
import {IGeometry} from '../../../interface/igeometry';
import {PolyGon} from '../../../geometries/Poly/Polygon/poly-gon';
import {PolyLine} from '../../../geometries/Poly/Polyline/poly-line';

export class PolyDrawerBase implements IDrawer {

  // region IDrawer Member
  OnInitialized: Subject<IGeometry>;
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
  protected object: PolyGon | PolyLine;
  // endregion

  constructor() {
    this.OnInitialized = new Subject();
    this.OnRequestRender = new Subject();
    this.points = new Array<PIXI.Point>();
  }

  // region Events
  private registerEvents() {
    this.object.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    this.object.OnInitialized.subscribe(value => {
      this.object.EnableControls(false);
      this.OnInitialized.next(this.object);
    });
  }
  // endregion

  // region IDrawer
  Init() {
    this.registerEvents();
    this.object.Init();
  }

  OnEvent(event: PIXI.interaction.InteractionEvent) {
    if (event.type === 'click' || event.type === 'tap') {
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      this.points.push(newPos);
      this.object.UpdatePoints(this.points);
    }
    if (event.type === ' rightclick') {
      this.points.pop();
      this.object.UpdatePoints(this.points);
    }
  }
  // endregion
}
