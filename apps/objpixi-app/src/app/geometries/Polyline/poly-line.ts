import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import {MoveDelta, Mover} from '../../interaction/moving/mover';
import {PolyInfo} from './poly-info';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {ScalingEvent} from '../../interface/events/scaling-event';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';
import Graphics = PIXI.Graphics;

export class PolyLine extends BaseGeo implements IGeometry {
  public MainDisObject: PIXI.Container;
  private readonly scalerOffset = 15;
  private readonly pointNamePrefix = 'P_';
  private readonly Mover: Mover;
  private info: PolyInfo;
  dragStates: { [id: string]: boolean; } = {};
  lastPositions: { [id: string]: PIXI.Point};
  Scaler: IScaler;

  constructor(polyInfo: PolyInfo, name?: string) {
    super(name);
    this.info = polyInfo;
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


  private getPointContainer(points: Array<PIXI.Point>, pointRadius: number): PIXI.DisplayObject {
    this.dragStates = {};
    this.lastPositions = {};
    const container = new PIXI.Container();
    container.name = 'points';
    points.forEach((p, i) => {
      const tmpPoint = this.getPointGraphic(p.x, p.y, pointRadius);
      tmpPoint.name = this.pointNamePrefix + i;
      this.lastPositions[tmpPoint.name] = new PIXI.Point(p.x, p.y);
      this.registerPointEvents(tmpPoint);
      container.addChild(tmpPoint);
    });
    return container;
  }

  private getLineContainer(points: Array<PIXI.Point>, lineWidth: number): PIXI.DisplayObject {
    const container = new PIXI.Container();
    container.name = 'lines';
    const g = new PIXI.Graphics();
    g.lineStyle(lineWidth, 0xffd900, 1);
    g.moveTo(points[0].x, points[0].y);
    points.forEach(p => {
      g.lineTo(p.x, p.y);
    });
    container.addChild(g);
    return container;
  }

  private getPointGraphic(x, y, radius): PIXI.DisplayObject {
    const g = new Graphics();
    g.beginFill(0xb0003a);
    g.drawCircle(x, y, radius);
    g.endFill();
    return g;
  }


  private refreshGraphic(info: PolyInfo, render = true) {
    this.refreshLines(info);
    this.refreshPoints(info);
    this.registerEvents();
    if (render) {
      this.OnRequestRender.next();
    }
  }

  private refreshLines(info: PolyInfo) {
    const lContainer = this.getLineContainer(info.points, info.lineWidth);
    lContainer.zIndex = 3;
    const toDeleteL = this.GContainer.getChildByName('lines');
    this.GContainer.removeChild(toDeleteL);
    this.GContainer.addChild(lContainer);
  }

  private refreshPoints(info: PolyInfo) {
    const pContainer = this.getPointContainer(info.points, info.pointRadius);
    const toDeleteP = this.GContainer.getChildByName('points');
    pContainer.zIndex = 5;
    this.GContainer.removeChild(toDeleteP);
    this.GContainer.addChild(pContainer);

  }

  // endregion

  // region Scaling And Move handling

  private handleScaling(event: ScalingEvent) {
    switch (event.direction) {
      case ScaleDirection.Up:
      case ScaleDirection.Down:
        for (const p of this.info.points) {
          p.y += event.delta.y;
        }
        this.refreshGraphic(this.info, false);
        break;
      case ScaleDirection.Left:
      case ScaleDirection.Right:
        for (const p of this.info.points) {
          p.x += event.delta.x;
        }
        this.refreshGraphic(this.info, false);
        break;
    }
  }

  private handleMove(moveEvent: MoveDelta) {
    for (const p of this.info.points) {
      p.x += moveEvent.x;
      p.y += moveEvent.y;
    }
    this.refreshGraphic(this.info, false);
  }

  private getDelta(newPos: PIXI.Point, pointName: string): PIXI.Point {
    const x =  newPos.x - this.lastPositions[pointName].x;
    const y = newPos.y - this.lastPositions[pointName].y;
    this.lastPositions[pointName].x = newPos.x;
    this.lastPositions[pointName].y = newPos.y;
    return new PIXI.Point(x, y);
  }

  private lastPointsToInfo() {
    const points: Array<PIXI.Point> = [];
    const keys = Object.keys(this.lastPositions);
    keys.forEach(k => {
      points.push(this.lastPositions[k]);
    });
    this.info.points = points;
  }

  // endregion

  // region Init

  private registerPointEvents(point: PIXI.DisplayObject) {
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
      this.refreshLines(this.info);
      this.OnRequestRender.next();
    });
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

  // endregion

  // region IGeometry

  Init(): void {
    const container = new PIXI.Container();
    this.GContainer = new PIXI.Container();
    const points = this.getPointContainer(this.info.points, this.info.pointRadius);
    const lines = this.getLineContainer(this.info.points, this.info.lineWidth);
    this.GContainer.addChild(lines);
    this.GContainer.addChild(points);
    this.Scaler.Generate({obj: points, offset: this.scalerOffset});
    this.Mover.Generate(points.getBounds());
    container.addChild(this.GContainer);
    container.addChild(this.Scaler.GetObject());
    container.addChild(this.Mover.GetObject());
    this.MainDisObject = container;
    this.OnInitialized.next(this.MainDisObject);
  }

  ClearSelection(): void {
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
