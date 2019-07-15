import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import {MoveDelta, Mover} from '../../interaction/moving/mover';
import * as PIXI from 'pixi.js';
import {LineInfo} from './line-info';

export class Line extends BaseGeo implements IGeometry {
  // region Helper
  Scaler: IScaler;
  private readonly Mover: Mover;
  // endregion

  // region Member
  private MainDisObject: PIXI.Container;
  private info: LineInfo;
  // endregion

  // region States
  private atMove = false;
  private dragStates: { [id: string]: boolean; } = {};
  private lastPositions: { [id: string]: PIXI.Point };
  // endregion

  // region Read only variables
  private readonly pointNamePrefix = 'P_';
  private readonly cNamePoint = 'CONTAINER_POINTS';
  private readonly cNameLines = 'CONTAINER_LINES';

  // endregion

  constructor(lineInfo: LineInfo, name?: string) {
    super(name);
    this.info = lineInfo;
    this.Mover = new Mover();
    this.registerMoveEvents();
  }

  // region Statics

  // TODO outsource in utility class
  private getPointGraphic(x, y): PIXI.DisplayObject {
    const pStyle = this.info.style.pointStyle;
    const g = new PIXI.Graphics();
    if (pStyle.fillStyle.useFill) {
      g.beginFill(pStyle.fillStyle.fillColor, pStyle.fillStyle.fillAlpha);
    }
    if (pStyle.fillStyle.useLine) {
      g.lineStyle(pStyle.fillStyle.lineWidth, pStyle.fillStyle.lineColor, pStyle.fillStyle.lineAlpha);
    }
    g.drawCircle(x, y, pStyle.radius);
    if (pStyle.fillStyle.useFill) {
      g.endFill();
    }
    return g;
  }

  // endregion

  // region Graphics

  private refreshGraphic(render = true) {
    this.refreshLines();
    this.refreshPoints();
    if (render) {
      this.OnRequestRender.next();
    }
  }

  private refreshPoints() {
    const pContainer = this.getPointContainer([this.info.p1, this.info.p2]);
    if (!this.atMove) {
      pContainer.visible = false;
    }
    const toDeleteP = this.GContainer.getChildByName(this.cNamePoint);
    this.GContainer.removeChild(toDeleteP);
    this.GContainer.addChild(pContainer);
  }

  private refreshLines() {
    const lContainer = this.getLineContainer([this.info.p1, this.info.p2]);
    lContainer.zIndex = 3;
    const toDeleteL = this.GContainer.getChildByName(this.cNameLines);
    this.GContainer.removeChild(toDeleteL);
    this.GContainer.addChild(lContainer);
    this.GContainer.setChildIndex(lContainer, 0);
    this.createHitArea(lContainer);
  }

  // TODO outsource in utility class
  private getPointContainer(points: Array<PIXI.Point>): PIXI.DisplayObject {
    this.dragStates = {};
    this.lastPositions = {};
    const container = new PIXI.Container();
    container.name = this.cNamePoint;
    points.forEach((p, i) => {
      const tmpPoint = this.getPointGraphic(p.x, p.y);
      tmpPoint.name = this.pointNamePrefix + i;
      this.lastPositions[tmpPoint.name] = new PIXI.Point(p.x, p.y);
      this.registerPointEvents(tmpPoint);
      container.addChild(tmpPoint);
    });
    return container;
  }

  private getLineContainer(points: Array<PIXI.Point>): PIXI.Container {
    const container = new PIXI.Container();
    container.name = this.cNameLines;
    const g = new PIXI.Graphics();
    const lStyle = this.info.style;
    g.lineStyle(lStyle.lineWidth, lStyle.color, lStyle.alpha);
    g.moveTo(points[0].x, points[0].y);
    points.forEach(p => {
      g.lineTo(p.x, p.y);
    });
    container.addChild(g);
    return container;
  }

  // endregion

  // region Events

  private registerMoveEvents() {
    this.Mover.OnMoveEnd.subscribe(() => {
      this.atMove = false;
    });
    this.Mover.OnRequestRender.subscribe(() => {
      this.OnRequestRender.next();
    });
    this.Mover.OnMoved.subscribe(value => {
      this.atMove = true;
      this.handleMove(value);
    });
  }

  // TODO outsource in utility class
  private registerPointEvents(point: PIXI.DisplayObject) {
    if (!this.enableControl) {
      return;
    }
    point.interactive = true;
    point.buttonMode = true;
    this.dragStates[point.name] = false;
    point.addListener('pointerdown', event1 => {
      this.dragStates[event1.currentTarget.name] = true;
    });
    point.addListener('pointerup', event1 => {
      this.dragStates[event1.currentTarget.name] = false;
    });
    point.addListener('pointerupoutside', event1 => {
      this.dragStates[event1.currentTarget.name] = false;
    });
    point.addListener('pointermove', event1 => {
      if (!this.dragStates[event1.currentTarget.name]) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      const delta = this.getDelta(newPos, event1.currentTarget.name);
      event1.currentTarget.x += delta.x;
      event1.currentTarget.y += delta.y;
      this.lastPointsToInfo();
      this.refreshLines();
      this.Mover.recenter(this.GContainer.getBounds());
      this.OnRequestRender.next();
      this.OnChange.next({sender: this, points: this.GetPoints()});
    });
  }

  private registerContainerEvents(container: PIXI.DisplayObject) {
    if (!this.enableControl) {
      return;
    }
    container.addListener('click', event1 => {
      this.GContainer.getChildByName(this.cNamePoint).visible = true;
      this.Mover.SetVisibility(true);
      this.OnInteraction.next({event: event1, target: this});
      this.OnRequestRender.next();
    });
    container.addListener('tap', event1 => {
      this.OnInteraction.next({event: event1, target: this});
      this.GContainer.getChildByName(this.cNamePoint).visible = true;
      this.Mover.SetVisibility(true);
      this.OnRequestRender.next();
    });
  }

  // endregion

  // region Scaling and move handling

  handleMove(moveEvent: MoveDelta) {
    this.info.p1.x += moveEvent.x;
    this.info.p2.x += moveEvent.x;
    this.info.p1.y += moveEvent.y;
    this.info.p2.y += moveEvent.y;
    this.refreshGraphic( false);
    this.OnRequestRender.next();
    this.OnChange.next({sender: this, points: this.GetPoints()});
  }

  private createHitArea(container: PIXI.Container) {
    container.interactive = true;
    container.buttonMode = true;
    container.hitArea = container.getBounds();
    this.registerContainerEvents(container);
  }
  // endregion

  // region Calculations
  private lastPointsToInfo() {
    // TODO very inefficient
    const points: Array<PIXI.Point> = [];
    const keys = Object.keys(this.lastPositions);
    keys.forEach(k => {
      points.push(this.lastPositions[k]);
    });
    this.info.p1 = points[0];
    this.info.p2 = points[1];
  }

  private getDelta(newPos: PIXI.Point, pointName: string): PIXI.Point {
    const x = newPos.x - this.lastPositions[pointName].x;
    const y = newPos.y - this.lastPositions[pointName].y;
    this.lastPositions[pointName].x = newPos.x;
    this.lastPositions[pointName].y = newPos.y;
    return new PIXI.Point(x, y);
  }
  // endregion

  // region IGeometry

  Init(): void {
    const container = new PIXI.Container();
    this.GContainer = new PIXI.Container();
    const points = this.getPointContainer([this.info.p1, this.info.p2]);
    points.visible = false;
    const lines = this.getLineContainer([this.info.p1, this.info.p2]);
    this.createHitArea(lines);
    this.GContainer.addChild(lines);
    this.GContainer.addChild(points);
    this.Mover.Generate(points.getBounds());
    container.addChild(this.GContainer);
    container.addChild(this.Mover.GetObject());
    this.MainDisObject = container;
    this.OnInitialized.next(this.MainDisObject);
  }

  ClearSelection(): void {
    this.GContainer.getChildByName(this.cNamePoint).visible = false;
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

  GetPoints(): Array<PIXI.Point> {
    return [this.info.p1, this.info.p2];
  }

  UpdatePoints(points: Array<PIXI.Point>) {
    this.info.p1 = points[0];
    this.info.p2 = points[1];
    this.refreshGraphic(false);
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

  // endregion
}
