import * as PIXI from 'pixi.js';
import {IGeometry} from '../../interface/igeometry';
import {Point} from '../../geometries/Point/point';
import {Subject} from 'rxjs';
import {Line} from '../../geometries/Line/line';
import {IStyleLine} from '../../styles/istyle-line';


export class DrawWizard {
  private drawContainer: PIXI.Container;
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
      if (this.dragged) {
        return;
      }
      this.addPoint();
      this.dragStart = true;
    });
    obj.addListener('click', event1 => {
      if (this.dragged) {
        return;
      }
      this.addPoint();
      this.dragStart = true;
    });
    obj.addListener('pointerdown', event1 => {
      this.clickPoint = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.dragStart = true;
    });
    obj.addListener('pointermove', event1 => {
      console.log('Move %s', this.dragStart);
      if (!this.dragStart) {
        return;
      }
      console.log('MOVE');
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.onMove(newPos);
    });
    obj.addListener('pointerup', event1 => {
      this.dragStart = false;
    });
  }

  private clear() {
    this.drawContainer.removeChildren();
  }

  private addPoint() {
    this.clear();
    this.editGeo = new Point({position: this.clickPoint, enableInteractive: false});
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
