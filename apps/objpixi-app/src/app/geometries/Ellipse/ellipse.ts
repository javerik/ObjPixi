import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import {EllipseInfo} from './ellipse-info';
import {MoveDelta, Mover} from '../../interaction/moving/mover';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {ScalingEvent} from '../../interface/events/scaling-event';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';

export class Ellipse extends BaseGeo implements IGeometry {
  Scaler: IScaler;
  private readonly scalerOffset = 15;
  private readonly Mover: Mover;
  private info: EllipseInfo;
  public MainDisObject: PIXI.Container;


  constructor(ellipseInfo: EllipseInfo, name?: string) {
    super(name);
    this.info = ellipseInfo;
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

  // region Graphics

  private getGraphicFromInfo(info: EllipseInfo): PIXI.DisplayObject {
    return this.getGraphic(info.position.x, info.position.y, info.width, info.height, info.center);
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
    g.drawEllipse(x, y, w / 2, h / 2);
    g.endFill();
    return g;
  }

  private refreshGraphic(info: EllipseInfo, render = true) {
    const nG = this.getGraphicFromInfo(info);
    nG.name = 'origin';
    const orig = this.GContainer.getChildByName('origin');
    this.GContainer.removeChild(orig);
    this.GContainer.addChild(nG);
    this.registerEvents();
    if (render) {
      this.OnRequestRender.next();
    }
  }

  // endregion

  // region Scaling And Move handling

  private handleScaling(event: ScalingEvent) {
    const leftP = event.ArrowPositions.find(value => value.dir === ScaleDirection.Left).point;
    const rightP = event.ArrowPositions.find(value => value.dir === ScaleDirection.Right).point;
    const topP = event.ArrowPositions.find(value => value.dir === ScaleDirection.Up).point;
    const bottomP = event.ArrowPositions.find(value => value.dir === ScaleDirection.Down).point;

    const w = rightP.x - leftP.x;
    const h = bottomP.y - topP.y;
    switch (event.direction) {
      case ScaleDirection.Up:
      case ScaleDirection.Down:
        this.info.height = (h - (this.scalerOffset * 2));
        this.info.position.y += event.delta.y / 2;
        break;
      case ScaleDirection.Left:
      case ScaleDirection.Right:
        this.info.width = (w - (this.scalerOffset * 2));
        this.info.position.x += event.delta.x / 2;
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

  // endregion

  // region Init

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

  // endregion

  // region IGeometry

  Init(): void {
    this.GContainer = new PIXI.Container();
    const ellipse = this.getGraphicFromInfo(this.info);
    ellipse.name = 'origin';
    this.GContainer.addChild(ellipse);
    const container = new PIXI.Container();
    this.Scaler.Generate({obj: ellipse, offset: this.scalerOffset});
    this.Mover.Generate(ellipse.getBounds());
    container.addChild(this.GContainer);
    container.addChild(this.Scaler.GetObject());
    container.addChild(this.Mover.GetObject());
    this.MainDisObject = container;
    this.registerEvents();
    this.OnInitialized.next(this.MainDisObject);
  }

  ClearSelection(): void {
    this.Scaler.SetVisibility(false);
    this.Mover.SetVisibility(false);
  }

  GetId(): string {
    return this.Id;
  }

  GetName(): string {
    return this.Name;
  }

  GetObject(): PIXI.DisplayObject {
    return this.MainDisObject;
  }

  SetName(name: string) {
    this.Name = name;
  }

  // endregion
}
