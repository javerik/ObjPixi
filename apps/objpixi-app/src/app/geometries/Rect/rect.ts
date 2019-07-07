import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';

export class Rect extends BaseGeo implements IGeometry {
  private readonly scalerOffset = 15;
  Scaler: IScaler;
  public MainDisObject: PIXI.DisplayObject;
  private originInfo: RectInfo;

  constructor(info: RectInfo, name?: string) {
    super(name);
    this.originInfo = info;
    this.Scaler = new BasicScaler();
  }

  public Init() {
    const rect = this.getGraphic();
    rect.interactive = true;
    rect.buttonMode = true;
    rect.addListener('pointerupoutside', event1 => {
      this.OnInteraction.next({target: this, event: event1});
    });
    rect.addListener('click', event1 => {
      this.OnInteraction.next({target: this, event: event1});
      this.Scaler.SetVisibility(true);
    });
    const container = new PIXI.Container();
    this.Scaler.OnRequestRender.subscribe(() => {
      this.OnRequestRender.next();
    });
    this.Scaler.Generate({obj: rect, offset: this.scalerOffset});
    container.addChild(rect);
    container.addChild(this.Scaler.GetObject());
    this.MainDisObject = container;
    this.OnInitialized.next(this.MainDisObject);
  }


  private getGraphic(): PIXI.DisplayObject {
    const g = new PIXI.Graphics();
    g.lineStyle(3, 0xfdd835);
    g.beginFill(0x9ccc65, 0.8);
    let x = this.originInfo.position.x;
    let y = this.originInfo.position.y;
    if (this.originInfo.center) {
      x = x - (this.originInfo.width / 2);
      y = y - (this.originInfo.height / 2);
    }
    g.drawRect(x, y, this.originInfo.width, this.originInfo.height);
    g.endFill();
    return g;
  }

  GetObject(): PIXI.DisplayObject {
    return undefined;
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
