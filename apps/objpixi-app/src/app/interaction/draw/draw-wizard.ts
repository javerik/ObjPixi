import * as PIXI from 'pixi.js';
import {IGeometry} from '../../interface/igeometry';
import {Point} from '../../geometries/Point/point';
import {Subject} from 'rxjs';
import {Line} from '../../geometries/Line/line';
import {IStyleLine} from '../../styles/istyle-line';
import {GeometryType} from '../../interface/enums/geometry-type.enum';
import {IDrawer} from '../../interface/draw/idrawer';
import {DrawerPoint} from './Point/drawer-point';
import {DrawerLine} from './Line/drawer-line';
import {DrawerRect} from './Rect/drawer-rect';
import {DrawerPolyGon} from './Poly/drawer-poly-gon';
import {DrawerPolyLine} from './Poly/drawer-poly-line';


export class DrawWizard {
  private drawContainer: PIXI.Container;
  private currentGeoType: GeometryType = null;
  // region Drawer
  private drawer: IDrawer;
  // endregion
  private editGeo: IGeometry;
  private clickPoint: PIXI.Point = new PIXI.Point();
  private dragStart = false;
  private dragged = false;
  public OnRequestRender: Subject<null>;
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
  }

  public SetGeometryType(type: GeometryType) {
    this.clear();
    this.currentGeoType = type;
    switch (this.currentGeoType) {
      case GeometryType.Point:
        this.drawer = new DrawerPoint();
        break;
      case GeometryType.Ellipse:
        break;
      case GeometryType.Line:
        this.drawer = new DrawerLine();
        break;
      case GeometryType.Rect:
        this.drawer = new DrawerRect();
        break;
      case GeometryType.Polygon:
        this.drawer = new DrawerPolyGon();
        break;
      case GeometryType.Polyline:
        this.drawer = new DrawerPolyLine();
        break;
    }
    this.drawer.OnInitialized.subscribe(value => {
      this.drawContainer.addChild(value.GetObject());
    });
    this.drawer.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    this.drawer.Init();
  }

  public Init(w, h, callback: (object: PIXI.DisplayObject) => void) {
    this.drawContainer = new PIXI.Container();
    this.drawContainer.x = 0;
    this.drawContainer.y = 0;
    this.drawContainer.width = w;
    this.drawContainer.height = h;
    this.drawContainer.hitArea = new PIXI.Rectangle(0, 0, w, h);
    this.drawContainer.interactive = true;
    this.drawContainer.buttonMode = true;
    this.drawContainer.zIndex = 100;
    this.registerEvents(this.drawContainer);
    callback(this.drawContainer);
  }

  private registerEvents(obj: PIXI.DisplayObject) {
    obj.addListener('tap', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
    });
    obj.addListener('click', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
    });
    obj.addListener('pointerdown', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
    });
    obj.addListener('pointermove', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
    });
    obj.addListener('pointerup', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
    });
    obj.addListener('rightclick', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
    });
  }

  private clear() {
    this.drawContainer.removeChildren();
  }

  private addPoint() {
    this.clear();
    this.editGeo = new Point({position: this.clickPoint});
    this.registerGeoEvents();
    this.editGeo.Init();
  }

  private onMove(pos: PIXI.Point) {
    this.clear();
    if (this.clickPoint === pos) {
      this.dragged = false;
      return;
    }
    this.dragged = true;
    this.editGeo = new Line({p1: this.clickPoint, p2: pos, style: this.lineStyle});
    this.registerGeoEvents();
    this.editGeo.Init();
  }

  private registerGeoEvents() {
    this.editGeo.OnInitialized.subscribe(value => {
      this.drawContainer.addChild(value);
      this.OnRequestRender.next();
    });
    this.editGeo.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
  }

}
