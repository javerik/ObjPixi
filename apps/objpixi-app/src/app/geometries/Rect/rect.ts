import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {ScalingEvent} from '../../interface/events/scaling-event';
import {MoveDelta, Mover} from '../../interaction/moving/mover';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';

export class Rect extends BaseGeo implements IGeometry {

  private readonly scalerOffset = 15;
  Scaler: IScaler;
  public MainDisObject: PIXI.Container;
  private info: RectInfo;
  private readonly Mover: Mover;

  constructor(info: RectInfo, name?: string) {
    super(name);
    this.info = info;
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
    this.Mover.OnMoveEnd.subscribe(value => {
    });
  }

  public Init() {
    this.GContainer = new PIXI.Container();
    if (this.info.center) {
      this.info.position.x = this.info.position.x - (this.info.width / 2);
      this.info.position.y = this.info.position.y - (this.info.height / 2);
    }
    const rect = this.getGraphicFromInfo(this.info);
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
    switch (event.direction) {
      case ScaleDirection.Up:
        this.info.position.y += event.delta.y;
        const dY = event.delta.y * -1;
        this.info.height += dY;
        break;
      case ScaleDirection.Down:
        this.info.height += event.delta.y;
        break;
      case ScaleDirection.Left:
        this.info.position.x += event.delta.x;
        const dX = event.delta.x * -1;
        this.info.width += dX;
        break;
      case ScaleDirection.Right:
        this.info.width += event.delta.x;
        break;

    }
    this.refreshGraphic(this.info, false);
    this.Mover.recenter(this.GContainer.getChildByName('origin').getBounds());
    this.OnRequestRender.next();
  }

  private handleMove(moveEvent: MoveDelta) {
    this.info.position.x += moveEvent.x;
    this.info.position.y += moveEvent.y;
    this.refreshGraphic(this.info, false);
    this.Scaler.Regenerate({obj: this.GContainer.getChildByName('origin'), offset: this.scalerOffset});
    this.OnRequestRender.next();
  }

  private refreshGraphic(rectInfo: RectInfo, render = true) {
    const nG = this.getGraphicFromInfo(rectInfo);
    nG.name = 'origin';
    const orig = this.GContainer.getChildByName('origin');
    this.GContainer.removeChild(orig);
    this.GContainer.addChild(nG);
    this.registerEvents();
    if (render) {
      this.OnRequestRender.next();
    }
  }

  // region IGeometry

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

  ClearSelection(): void {
    this.Mover.SetVisibility(false);
    this.Scaler.SetVisibility(false);
  }

  // endregion

}

export interface RectInfo {
  width: number;
  height: number;
  center: boolean;
  position: PIXI.Point;
}
