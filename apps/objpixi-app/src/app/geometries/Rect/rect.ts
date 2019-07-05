import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';

export class Rect extends BaseGeo implements IGeometry {
  public MainDisObject: PIXI.DisplayObject;
  private originInfo: RectInfo;

  constructor(info: RectInfo, name?: string) {
    let xName = '';
    if (name !== undefined) {
      xName = name;
    }
    super(xName);
    this.originInfo = info;
  }

  public Init() {
    this.MainDisObject = this.getGraphic();
    this.OnInitialized.next(this.MainDisObject);
    this.OnRequestRender.next();
    this.MainDisObject.interactive = true;
    this.MainDisObject.buttonMode = true;
    this.MainDisObject.addListener('pointerupoutside', event1 => {
      this.OnInteraction.next({target: this, event: event1});
    });
    this.MainDisObject.addListener('click', event1 => {
      this.OnInteraction.next({target: this, event: event1});
    });
  }


  private getGraphic(): PIXI.Graphics {
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
