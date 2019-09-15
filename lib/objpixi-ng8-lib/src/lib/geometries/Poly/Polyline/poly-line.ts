import * as PIXI from 'pixi.js';
import {IGeometry} from '../../../interface/igeometry';
import {PolyInfo} from '../poly-info';
import {PolyBase} from '../poly-base';
import {MoveDelta} from '../../../interaction/moving/mover';
import {GeometryType} from '../../../interface/enums/geometry-type.enum';

export class PolyLine extends PolyBase implements IGeometry {

  constructor(polyInfo: PolyInfo, name?: string) {
    super(polyInfo, name);
    this.Type = GeometryType.Polyline;
  }

  // region Graphics

  private getLineContainer(points: Array<PIXI.Point>): PIXI.Container {
    const container = new PIXI.Container();
    container.name = this.cNameLines;
    const g = new PIXI.Graphics();
    const style = this.info.style.fillStyle;
    g.lineStyle(style.lineWidth, style.lineColor, style.lineAlpha);
    g.moveTo(points[0].x, points[0].y);
    points.forEach(p => {
      g.lineTo(p.x, p.y);
    });
    container.addChild(g);
    return container;
  }

  protected refreshGraphic(info: PolyInfo, render = true) {
    this.refreshLines(info);
    super.refreshGraphic(info, render);
  }

  private refreshLines(info: PolyInfo) {
    const lContainer = this.getLineContainer(info.points);
    lContainer.zIndex = 3;
    const toDeleteL = this.GContainer.getChildByName(this.cNameLines);
    this.GContainer.removeChild(toDeleteL);
    this.GContainer.addChild(lContainer);
    this.GContainer.setChildIndex(lContainer, 0);
    this.createHitArea(lContainer);
  }

  // endregion

  // region Events

  protected handleMove(moveEvent: MoveDelta) {
    super.handleMove(moveEvent);
    this.OnChange.next({sender: this, points: this.GetPoints()});
  }

  protected registerContainerEvents(container: PIXI.DisplayObject) {
    container.addListener('click', event1 => {
      this.clickEvent(event1);
    });
    container.addListener('tap', event1 => {
      this.clickEvent(event1);
    });
  }


  private clickEvent(event1: any) {
    this.CtrlVisibleStates.mover = !this.CtrlVisibleStates.mover;
    this.Mover.SetVisibility(this.CtrlVisibleStates.mover);
    this.GContainer.getChildByName(this.cNamePoint).visible = true;
    this.OnInteraction.next({event: event1, target: this});
    this.OnRequestRender.next();
  }

  protected registerPointEvents(point: PIXI.DisplayObject) {
    super.registerPointEvents(point);
    point.addListener('pointermove', event1 => {
      if (!this.dragStates[event1.currentTarget.name]) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      const delta = this.getDelta(newPos, event1.currentTarget.name);
      event1.currentTarget.x += delta.x;
      event1.currentTarget.y += delta.y;
      this.lastPointsToInfo();
      this.refreshLines(this.info);
      this.Mover.recenter(this.GContainer.getBounds());
      this.OnRequestRender.next();
      this.OnChange.next({sender: this, points: this.GetPoints()});
    });
  }

// endregion

  // region IGeometry

  Init(): void {
    const container = new PIXI.Container();
    this.GContainer = new PIXI.Container();
    const points = this.getPointContainer(this.info.points);
    points.visible = false;
    const lines = this.getLineContainer(this.info.points);
    this.createHitArea(lines);
    this.GContainer.addChild(lines);
    this.GContainer.addChild(points);
    this.Mover.Generate(points.getBounds());
    container.addChild(this.GContainer);
    container.addChild(this.Mover.GetObject());
    container.addChild(this.LabelContainer);
    this.Label.Init();
    this.MainDisObject = container;
    this.OnInitialized.next(this.MainDisObject);
  }

  ClearSelection(): void {
    this.GContainer.getChildByName(this.cNamePoint).visible = false;
    this.Label.ClearSelection();
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


  GetPoints(): Array<PIXI.Point> {
    return this.info.points;
  }

  UpdatePoints(points: Array<PIXI.Point>) {
    this.info.points = points;
    this.refreshGraphic(this.info, false);
    this.Mover.recenter(this.GContainer.getBounds());
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
    this.Mover.SetVisibility(true);
  }

  GetStyle(): any {
    return this.info.style;
  }

  SetStyle(style: any) {
    this.info.style = style;
    this.refreshGraphic(this.info, true);
  }

  // endregion
}
