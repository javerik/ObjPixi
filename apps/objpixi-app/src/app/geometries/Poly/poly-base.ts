import * as PIXI from 'pixi.js';
import {BaseGeo} from '../base-geo';
import {PolyInfo} from './poly-info';
import {IScaler} from '../../interface/iscaler';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {MoveDelta, Mover} from '../../interaction/moving/mover';
import {ScalingEvent} from '../../interface/events/scaling-event';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';

export class PolyBase extends BaseGeo {

  // region Helper
  public Scaler: IScaler;
  protected readonly Mover: Mover;
  // endregion

  // region Member
  protected MainDisObject: PIXI.Container;
  protected info: PolyInfo;
  // endregion

  // region States
  protected atMove = false;
  protected dragStates: { [id: string]: boolean; } = {};
  protected lastPositions: { [id: string]: PIXI.Point };
  // endregion

  // region Read only variables
  protected readonly pointNamePrefix = 'P_';
  protected readonly cNamePoint = 'CONTAINER_POINTS';
  protected readonly cNameLines = 'CONTAINER_LINES';
  protected readonly cNamePolygon = 'CONTAINER_POLYGON';
  // endregion

  constructor(polyInfo: PolyInfo, name?: string) {
    super(name);
    this.info = polyInfo;
    this.Scaler = new BasicScaler();
    this.Mover = new Mover();
    this.registerMoveEvents();
  }

  // region Statics

  protected static getPointGraphic(x, y, radius): PIXI.DisplayObject {
    const g = new PIXI.Graphics();
    g.beginFill(0xb0003a);
    g.drawCircle(x, y, radius);
    g.endFill();
    return g;
  }

  // endregion

  // region Graphics

  protected refreshGraphic(info: PolyInfo, render = true) {
    this.refreshPoints(info);
    if (render) {
      this.OnRequestRender.next();
    }
  }

  protected getPointContainer(points: Array<PIXI.Point>, pointRadius: number): PIXI.DisplayObject {
    this.dragStates = {};
    this.lastPositions = {};
    const container = new PIXI.Container();
    container.name = this.cNamePoint;
    points.forEach((p, i) => {
      const tmpPoint = PolyBase.getPointGraphic(p.x, p.y, pointRadius);
      tmpPoint.name = this.pointNamePrefix + i;
      this.lastPositions[tmpPoint.name] = new PIXI.Point(p.x, p.y);
      this.registerPointEvents(tmpPoint);
      container.addChild(tmpPoint);
    });
    return container;
  }

  protected refreshPoints(info: PolyInfo) {
    const pContainer = this.getPointContainer(info.points, info.pointRadius);
    if (!this.atMove) {
      pContainer.visible = false;
    }
    const toDeleteP = this.GContainer.getChildByName(this.cNamePoint);
    pContainer.zIndex = 5;
    this.GContainer.removeChild(toDeleteP);
    this.GContainer.addChild(pContainer);
  }

  // endregion

  // region Events
  protected registerMoveEvents() {
    this.Mover.OnMoveEnd.subscribe(value => {
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

  protected registerPointEvents(point: PIXI.DisplayObject) {
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
  }

  protected registerContainerEvents(container: PIXI.DisplayObject) {
    // dummy
  }

  // endregion

  // region Scaling and move handling

  protected handleScaling(event: ScalingEvent) {
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
    this.OnRequestRender.next();
  }

  protected handleMove(moveEvent: MoveDelta) {
    for (const p of this.info.points) {
      p.x += moveEvent.x;
      p.y += moveEvent.y;
    }
    this.refreshGraphic(this.info, false);
    this.OnRequestRender.next();
  }

  protected createHitArea(container: PIXI.Container) {
    container.interactive = true;
    container.buttonMode = true;
    container.hitArea = container.getBounds();
    this.registerContainerEvents(container);
  }
  // endregion

  // region Calculations

  protected lastPointsToInfo() {
    // TODO very inefficient
    const points: Array<PIXI.Point> = [];
    const keys = Object.keys(this.lastPositions);
    keys.forEach(k => {
      points.push(this.lastPositions[k]);
    });
    this.info.points = points;
  }

  protected getDelta(newPos: PIXI.Point, pointName: string): PIXI.Point {
    const x = newPos.x - this.lastPositions[pointName].x;
    const y = newPos.y - this.lastPositions[pointName].y;
    this.lastPositions[pointName].x = newPos.x;
    this.lastPositions[pointName].y = newPos.y;
    return new PIXI.Point(x, y);
  }

  // endregion

}
