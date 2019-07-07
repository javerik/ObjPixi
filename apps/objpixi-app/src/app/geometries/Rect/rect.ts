import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';
import {ScalingEvent} from '../../interface/events/scaling-event';

export class Rect extends BaseGeo implements IGeometry {
  private readonly scalerOffset = 15;
  Scaler: IScaler;
  public MainDisObject: PIXI.Container;
  private originInfo: RectInfo;
  private transformedInfo: RectInfo;


  constructor(info: RectInfo, name?: string) {
    super(name);
    this.originInfo = info;
    this.transformedInfo = {
      height: this.originInfo.height,
      center: this.originInfo.center,
      position: new PIXI.Point(this.originInfo.position.x, this.originInfo.position.y),
      width: this.originInfo.width
    };
    this.Scaler = new BasicScaler();
  }

  public Init() {
    const rect = this.getGraphicFromInfo(this.originInfo);
    rect.name = 'origin';
    /*
    rect.addListener('pointerupoutside', event1 => {
      this.OnInteraction.next({target: this, event: event1});
    });
    rect.addListener('click', event1 => {
      this.OnInteraction.next({target: this, event: event1});
      this.Scaler.SetVisibility(true);
    });*/
    const container = new PIXI.Container();
    this.Scaler.OnRequestRender.subscribe(() => {
      this.OnRequestRender.next();
    });
    this.Scaler.OnScaleEvent.subscribe(value => {
      /*
      if (value.direction === ScaleDirection.Up) {
        this.transformedInfo.height = this.originInfo.height + value.delta.y;
        this.transformedInfo.position.y = this.originInfo.position.y - value.delta.y;
        const nG = this.getGraphicFromInfo(this.transformedInfo);
        nG.name = 'origin';
        const orig = this.MainDisObject.getChildByName('origin');
        this.MainDisObject.removeChild(orig);
        this.MainDisObject.addChild(nG);
        this.registerEvents();
        this.OnRequestRender.next();
      }*/
      this.handleScaling(value);
    });
    this.Scaler.Generate({obj: rect, offset: this.scalerOffset});
    container.addChild(rect);
    container.addChild(this.Scaler.GetObject());
    this.MainDisObject = container;
    this.registerEvents();
    this.OnInitialized.next(this.MainDisObject);
  }

  private getGraphicFromInfo(info: RectInfo): PIXI.DisplayObject {
    return this.getGraphic(info.position.x, info.position.y, info.width, info.height);
  }

  private getGraphic(x, y, w, h, center = true): PIXI.DisplayObject {
    const g = new PIXI.Graphics();
    g.lineStyle(3, 0xfdd835);
    g.beginFill(0x9ccc65, 0.8);
    let px = x;
    let py = y;
    if (center) {
      px = px - (w / 2);
      py = py - (h / 2);
    }
    g.drawRect(x, y, w, h);
    g.endFill();
    return g;
  }

  private registerEvents() {
    const obj = this.MainDisObject.getChildByName('origin');
    obj.interactive = true;
    obj.buttonMode = true;
    obj.addListener('pointerupoutside', event1 => {
      this.OnInteraction.next({target: this, event: event1});
    });
    obj.addListener('click', event1 => {
      this.OnInteraction.next({target: this, event: event1});
      this.Scaler.SetVisibility(true);
    });
  }

  private handleScaling(event: ScalingEvent) {


    this.transformedInfo.position.y = this.originInfo.position.y - event.deltas[0].delta.y;
    this.transformedInfo.position.x = this.originInfo.position.x - event.deltas[1].delta.x;
    this.transformedInfo.width = this.originInfo.width + (event.deltas[1].delta.x + event.deltas[2].delta.x);
    this.transformedInfo.height = this.originInfo.height + (event.deltas[0].delta.y + event.deltas[3].delta.y);

    const nG = this.getGraphicFromInfo(this.transformedInfo);
    nG.name = 'origin';
    const orig = this.MainDisObject.getChildByName('origin');
    this.MainDisObject.removeChild(orig);
    this.MainDisObject.addChild(nG);
    this.registerEvents();
    this.OnRequestRender.next();
  }

  GetObject(): PIXI.DisplayObject {
    return this.MainDisObject;
  }

  GetId(): string {
    return this.Id;
  }

  GetName(): string {
    return this.Name;
  }

  SetName(name: string) {
    this.Name = name;
  }

}

export interface RectInfo {
  width: number;
  height: number;
  center: boolean;
  position: PIXI.Point;
}
