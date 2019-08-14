import * as PIXI from 'pixi.js';
import {IGeometry} from '../../interface/igeometry';
import {Subject} from 'rxjs';
import {IStyleLine} from '../../styles/istyle-line';
import {GeometryType} from '../../interface/enums/geometry-type.enum';
import {IDrawer} from '../../interface/draw/idrawer';
import {DrawerPoint} from './Point/drawer-point';
import {DrawerLine} from './Line/drawer-line';
import {DrawerRect} from './Rect/drawer-rect';
import {DrawerPolyGon} from './Poly/drawer-poly-gon';
import {DrawerPolyLine} from './Poly/drawer-poly-line';
import {IPositionIndicator} from '../../interface/info/iposition-indicator';
import {DefaultPositionIndicator} from '../info/default-position-indicator';
import {PositionIndicatorInfo} from '../../interface/info/position-indicator-info';
import {DrawerEllipse} from './Ellipse/drawer-ellipse';
import {IDrawAcceptor} from '../../interface/draw/idraw-acceptor';
import {validate} from 'codelyzer/walkerFactory/walkerFn';


export class DrawWizard {
  private mainContainer: PIXI.Container;
  private drawContainer: PIXI.Container;
  private currentGeoType: GeometryType = null;
  // region Drawer
  private drawer: IDrawer;
  private positionIndicator: IPositionIndicator;
  private acceptor: IDrawAcceptor;
  // endregion
  private winSize: PIXI.Point = new PIXI.Point();
  public OnRequestRender: Subject<null>;
  public OnGeometryAccepted: Subject<IGeometry>;
  public OnCancelDraw: Subject<any>;
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
  indicatorInfo: PositionIndicatorInfo = {
    position: new PIXI.Point(10, 10),
    lockPosition: true,
    moveBox: false
  };

  constructor(positionIndicator?: IPositionIndicator, acceptor?: IDrawAcceptor) {
    this.OnRequestRender = new Subject();
    this.OnGeometryAccepted = new Subject<IGeometry>();
    this.OnCancelDraw = new Subject<any>();
    if (positionIndicator === undefined) {
      this.positionIndicator = new DefaultPositionIndicator();
    }
    this.acceptor = acceptor;
    if (this.acceptor !== undefined) {
      this.registerAcceptorEvents();
    }
  }

  // region public interface

  public SetGeometryType(type: GeometryType) {
    this.clear();
    this.currentGeoType = type;
    switch (this.currentGeoType) {
      case GeometryType.Point:
        this.drawer = new DrawerPoint();
        break;
      case GeometryType.Ellipse:
        this.drawer = new DrawerEllipse();
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
      this.drawContainer.addChild(value);
      this.OnRequestRender.next();
    });
    this.drawer.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    if (this.acceptor !== undefined) {
      this.acceptor.SetGeometry(this.currentGeoType);
    }
    this.drawer.Init();
  }

  public Init(w, h, callback: (object: PIXI.DisplayObject) => void) {
    this.winSize.set(w, h);
    this.drawContainer = new PIXI.Container();
    this.mainContainer = new PIXI.Container();
    this.mainContainer.x = 0;
    this.mainContainer.y = 0;
    this.mainContainer.width = w;
    this.mainContainer.height = h;
    this.drawContainer.x = 0;
    this.drawContainer.y = 0;
    this.drawContainer.width = w;
    this.drawContainer.height = h;
    this.drawContainer.hitArea = new PIXI.Rectangle(0, 0, w, h);
    this.drawContainer.interactive = true;
    this.drawContainer.buttonMode = true;
    this.drawContainer.zIndex = 100;
    this.mainContainer.addChild(this.drawContainer);
    this.registerEvents(this.drawContainer);
    this.registerIndicatorEvents();
    this.positionIndicator.SetBorders(0, w, 0, h);
    this.positionIndicator.Init(this.indicatorInfo);
    this.acceptor.Init(this.winSize);
    callback(this.mainContainer);
  }

  // endregion

  // region register events

  private registerAcceptorEvents() {
    this.acceptor.OnInitialized.subscribe(obj => {
      obj.name = 'acceptor';
      this.mainContainer.addChild(obj);
      this.OnRequestRender.next();
    });
    this.acceptor.OnRequestRender.subscribe(() => {
      this.OnRequestRender.next();
    });
    this.acceptor.OnAccepted.subscribe( valid => {
      if (!valid) {
        this.drawer = null;
        this.clear();
        this.OnCancelDraw.next();
      } else {
        this.OnGeometryAccepted.next(this.drawer.GetGeometry());
        this.clear();
      }
    });
  }

  private registerIndicatorEvents() {
    this.positionIndicator.OnInitialized.subscribe(value => {
      this.mainContainer.addChild(value);
      this.OnRequestRender.next();
    });
    this.positionIndicator.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
  }

  private registerEvents(obj: PIXI.DisplayObject) {
    obj.addListener('tap', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
      this.acceptor.SetValidState(this.drawer.IsValid());
    });
    obj.addListener('click', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
      this.acceptor.SetValidState(this.drawer.IsValid());
    });
    obj.addListener('pointerdown', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
      this.acceptor.SetValidState(this.drawer.IsValid());
    });
    obj.addListener('pointermove', event1 => {
      this.positionIndicator.OnEvent(event1);
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
      this.acceptor.SetValidState(this.drawer.IsValid());
    });
    obj.addListener('pointerup', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
      this.acceptor.SetValidState(this.drawer.IsValid());
    });
    obj.addListener('rightclick', event1 => {
      if (this.drawer === undefined) {
        return;
      }
      this.drawer.OnEvent(event1);
      this.acceptor.SetValidState(this.drawer.IsValid());
    });
  }

  // endregion

  private clear() {
    this.drawContainer.removeChildren();
    this.drawer = undefined;
  }

}
