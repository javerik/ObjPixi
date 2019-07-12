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
  protected readonly pointNamePrefix;
  protected readonly cNamePoint;
  protected readonly cNameLines;
  protected readonly cNamePolygon;
  // endregion

  constructor(polyInfo: PolyInfo, name?: string) {
    super(name);
    this.pointNamePrefix = 'P_';
    this.cNamePoint = 'CONTAINER_POINTS';
    this.cNameLines = 'CONTAINER_LINES';
    this.cNamePolygon = 'CONTAINER_POLYGON';
    this.info = polyInfo;
    this.Scaler = new BasicScaler();
    this.Mover = new Mover();
    this.registerMoveEvents();
  }


  // region Graphics

  protected refreshGraphic(info: PolyInfo, render = true) {
    this.refreshPoints(info);
    if (render) {
      this.OnRequestRender.next();
    }
  }

  protected getPointContainer(points: Array<PIXI.Point>): PIXI.DisplayObject {
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

  protected refreshPoints(info: PolyInfo) {
    const pContainer = this.getPointContainer(info.points);
    if (!this.atMove) {
      pContainer.visible = false;
    }
    const toDeleteP = this.GContainer.getChildByName(this.cNamePoint);
    pContainer.zIndex = 5;
    this.GContainer.removeChild(toDeleteP);
    this.GContainer.addChild(pContainer);
  }

  protected getPointGraphic(x, y): PIXI.DisplayObject {
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
    if (!this.enableControl) {
      return;
    }
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
