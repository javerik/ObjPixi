import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {ScalingEvent} from '../../interface/events/scaling-event';
import {MoveDelta, Mover} from '../../interaction/moving/mover';

export class Rect extends BaseGeo implements IGeometry {
  private readonly scalerOffset = 15;
  Scaler: IScaler;
  public MainDisObject: PIXI.Container;
  private GContainer: PIXI.Container;
  private originInfo: RectInfo;
  private transformedInfo: RectInfo;
  private readonly Mover: Mover;

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
    this.Mover = new Mover();
    this.Scaler.OnRequestRender.subscribe(() => {
      this.OnRequestRender.next();
    });
    this.Scaler.OnScaleEvent.subscribe(value => {
      this.handleScaling(value);
    });
    this.Mover.OnRequestRender.subscribe(() => {
      this.OnRequestRender.next();
    });
    this.Mover.OnMoved.subscribe(value => {
      this.handleMove(value);
    });
  }

  public Init() {
    this.GContainer = new PIXI.Container();
    const rect = this.getGraphicFromInfo(this.originInfo);
    rect.name = 'origin';
    this.GContainer.addChild(rect);
    const container = new PIXI.Container();
    this.Scaler.Generate({obj: rect, offset: this.scalerOffset});
    this.Mover.Generate(rect.getBounds());
    container.addChild(this.GContainer);
    container.addChild(this.Scaler.GetObject());
    container.addChild(this.Mover.GetObject());
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
    const obj = this.GContainer.getChildByName('origin');
    obj.interactive = true;
    obj.buttonMode = true;
    obj.addListener('pointerupoutside', event1 => {
      this.OnInteraction.next({target: this, event: event1});
    });
    obj.addListener('click', event1 => {
      this.OnInteraction.next({target: this, event: event1});
      this.Scaler.SetVisibility(true);
      this.Mover.SetVisibility(true);
    });
  }

  private handleScaling(event: ScalingEvent) {
    this.transformedInfo.position.y = this.originInfo.position.y - event.deltas[0].delta.y;
    this.transformedInfo.position.x = this.originInfo.position.x - event.deltas[1].delta.x;
    this.transformedInfo.width = this.originInfo.width + (event.deltas[1].delta.x + event.deltas[2].delta.x);
    this.transformedInfo.height = this.originInfo.height + (event.deltas[0].delta.y + event.deltas[3].delta.y);

    this.refreshGraphic(this.transformedInfo);
  }

  private handleMove(moveEvent: MoveDelta) {
    this.transformedInfo.position.x = this.originInfo.position.x + moveEvent.x;
    this.transformedInfo.position.y = this.originInfo.position.y + moveEvent.y;
    this.refreshGraphic(this.transformedInfo);
  }

  private refreshGraphic(rectInfo: RectInfo) {
    const nG = this.getGraphicFromInfo(rectInfo);
    nG.name = 'origin';
    const orig = this.GContainer.getChildByName('origin');
    this.GContainer.removeChild(orig);
    this.GContainer.addChild(nG);
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
