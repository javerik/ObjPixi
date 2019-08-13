import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import {EllipseInfo} from './ellipse-info';
import {MoveDelta, Mover} from '../../interaction/moving/mover';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {ScalingEvent} from '../../interface/events/scaling-event';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';
import {GeometryType} from '../../interface/enums/geometry-type.enum';

export class Ellipse extends BaseGeo implements IGeometry {
  Scaler: IScaler;
  private readonly scalerOffset = 15;
  private readonly Mover: Mover;
  private info: EllipseInfo;
  public MainDisObject: PIXI.Container;

  constructor(ellipseInfo: EllipseInfo, name?: string) {
    super(name);
    this.Type = GeometryType.Ellipse;
    this.labelOffset = new PIXI.Point(12, 33);
    this.labelOffset.set(12, 33);
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
    this.Mover.OnMoveEnd.subscribe(() => {
    });
  }

  // region Graphics

  private getGraphicFromInfo(info: EllipseInfo): PIXI.DisplayObject {
    return this.getGraphic(info.coords.position.x, info.coords.position.y, info.coords.width, info.coords.height);
  }

  private getGraphic(x, y, w, h): PIXI.DisplayObject {
    const g = new PIXI.Graphics();
    const style = this.info.style;
    if (style.fillStyle.useLine) {
      g.lineStyle(style.fillStyle.lineWidth, style.fillStyle.lineColor, style.fillStyle.lineAlpha);
    }
    if (style.fillStyle.useFill) {
      g.beginFill(style.fillStyle.fillColor, style.fillStyle.fillAlpha);
    }
    g.drawEllipse(x, y, w / 2, h / 2);
    if (style.fillStyle.useFill) {
      g.endFill();
    }
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
        this.info.coords.height = (h - (this.scalerOffset * 2));
        this.info.coords.position.y += event.delta.y / 2;
        break;
      case ScaleDirection.Left:
      case ScaleDirection.Right:
        this.info.coords.width = (w - (this.scalerOffset * 2));
        this.info.coords.position.x += event.delta.x / 2;
        break;

    }
    this.refreshGraphic(this.info, false);
    this.Mover.recenter(this.GContainer.getChildByName('origin').getBounds());
    this.setLabelPosition();
    this.OnRequestRender.next();
    this.OnChange.next({sender: this, points: this.GetPoints()});
  }

  private handleMove(moveEvent: MoveDelta) {
    this.info.coords.position.x += moveEvent.x;
    this.info.coords.position.y += moveEvent.y;
    this.refreshGraphic(this.info, false);
    this.Scaler.Regenerate({obj: this.GContainer.getChildByName('origin'), offset: this.scalerOffset});
    this.setLabelPosition();
    this.OnRequestRender.next();
    this.OnChange.next({sender: this, points: this.GetPoints()});
  }

  protected setLabelPosition() {
    const p = new PIXI.Point(this.info.coords.position.x - (this.info.coords.width / 2),
      this.info.coords.position.y - (this.info.coords.height / 2));
    p.x -= this.labelOffset.x;
    p.y -= this.labelOffset.y;
    this.Label.SetOriginPosition(p);
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
    this.Scaler.SetVisibility(true);
    this.Mover.SetVisibility(true);
    this.Label.ClearSelection();
    this.OnInteraction.next({event, target: this});
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
    container.addChild(this.LabelContainer);
    this.registerLabelEvents();
    this.MainDisObject = container;
    this.registerEvents();
    this.OnInitialized.next(this.MainDisObject);
  }

  ClearSelection(): void {
    this.Scaler.SetVisibility(false);
    this.Mover.SetVisibility(false);
    this.Label.ClearSelection();
  }

  GetObject(): PIXI.DisplayObject {
    return this.MainDisObject;
  }

  GetPoints(): Array<PIXI.Point> {
    return [
      this.info.coords.position,
      new PIXI.Point(this.info.coords.width, this.info.coords.height)
    ];
  }

  UpdatePoints(points: Array<PIXI.Point>) {
    this.info.coords.position = points[0];
    this.info.coords.width = points[1].x;
    this.info.coords.height = points[1].y;
    this.refreshGraphic(this.info);
    this.Mover.recenter(this.GContainer.getChildByName('origin').getBounds());
    this.Scaler.Regenerate({obj: this.GContainer.getChildByName('origin'), offset: this.scalerOffset});
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

