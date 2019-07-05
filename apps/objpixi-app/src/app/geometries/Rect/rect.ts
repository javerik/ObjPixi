import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';

export class Rect extends BaseGeo {

  public MainDisObject: PIXI.DisplayObject;
  private originInfo: RectInfo;

  constructor(info: RectInfo) {
    super();
    this.originInfo = info;
  }

  public Init() {
    this.MainDisObject = this.getGraphic();
    this.OnInitialized.next(this.MainDisObject);
    this.OnRequestRender.next();
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

}

export interface RectInfo {
  width: number;
  height: number;
  center: boolean;
  position: PIXI.Point;
}
