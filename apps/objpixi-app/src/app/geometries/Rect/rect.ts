import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {ScalingEvent} from '../../interface/events/scaling-event';
import {MoveDelta, Mover} from '../../interaction/moving/mover';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';
import {RectInfo} from './rect-info';

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
    this.Mover.OnMoveEnd.subscribe(() => {
    });
  }

  // region Graphics
  private getGraphicFromInfo(info: RectInfo): PIXI.DisplayObject {
    return this.getGraphic(info.position.x, info.position.y, info.width, info.height);
  }

  private getGraphic(x, y, w, h): PIXI.DisplayObject {
    const g = new PIXI.Graphics();
    const style = this.info.style.fillStyle;
    if (style.useLine) {
      g.lineStyle(style.lineWidth, style.lineColor, style.lineAlpha);
    }
    if (style.useFill) {
      g.beginFill(style.fillColor, style.fillAlpha);
    }
    g.drawRect(x, y, w, h);
    if (style.useFill) {
      g.endFill();
    }
    return g;
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

  // endregion

  // region Events

  private registerEvents() {
    if (!this.enableControl) {
      return;
    }
    const obj = this.GContainer.getChildByName('origin');
    obj.interactive = true;
    obj.buttonMode = true;
    obj.addListener('pointerupoutside', event1 => {
      this.OnInteraction.next({event: event1, target: this});
    });
    obj.addListener('click', event1 => {
        this.onClick(event1);
    });
    obj.addListener('tap', event1 => {
      this.onClick(event1);
    });
  }

  private onClick(event: PIXI.interaction.InteractionEvent) {
    this.OnInteraction.next({event, target: this});
    this.Scaler.SetVisibility(true);
    this.Mover.SetVisibility(true);
    this.Label.ClearSelection();
  }

  // endregion

  // region Scaling and move handling
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
    this.OnChange.next({sender: this, points: this.GetPoints()});
  }

  private handleMove(moveEvent: MoveDelta) {
    this.info.position.x += moveEvent.x;
    this.info.position.y += moveEvent.y;
    this.refreshGraphic(this.info, false);
    this.Scaler.Regenerate({obj: this.GContainer.getChildByName('origin'), offset: this.scalerOffset});
    this.OnRequestRender.next();
    this.OnChange.next({sender: this, points: this.GetPoints()});
  }

  // endregion


  // region IGeometry

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
    container.addChild(this.LabelContainer);
    this.Label.Init();
    this.MainDisObject = container;
    this.registerEvents();
    this.OnInitialized.next(this.MainDisObject);
  }

  GetObject(): PIXI.DisplayObject {
    return this.MainDisObject;
  }

  ClearSelection(): void {
    this.Mover.SetVisibility(false);
    this.Scaler.SetVisibility(false);
  }

  GetPoints(): Array<PIXI.Point> {
    return [
      this.info.position,
      new PIXI.Point(this.info.width, this.info.height)
    ];
  }

  UpdatePoints(points: Array<PIXI.Point>) {
    this.info.position = points[0];
    this.info.width = points[1].x;
    this.info.height = points[1].y;
    this.refreshGraphic(this.info, false);
    this.Scaler.Regenerate({obj: this.GContainer.getChildByName('origin'), offset: this.scalerOffset});
    this.Mover.recenter(this.GContainer.getChildByName('origin').getBounds());
    this.OnRequestRender.next();
    this.OnChange.next({sender: this, points: this.GetPoints()});
  }

  EnableControls(state: boolean) {
    this.enableControl = state;
    if (!this.enableControl) {
      this.ClearSelection();
    }
    this.UpdatePoints(this.GetPoints());
  }

  ContainsPoint(point: PIXI.Point): boolean {
    return this.MainDisObject.getBounds().contains(point.x, point.y);
  }

  SetSelection() {
    this.Scaler.SetVisibility(true);
    this.Mover.SetVisibility(true);
  }

  // endregion

}
