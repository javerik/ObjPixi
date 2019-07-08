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
  Scaler: IScaler;

  constructor(polyInfo: PolyInfo, name?: string) {
    super(name);
    this.info = polyInfo;
    this.Scaler = new BasicScaler();
    this.Mover = new Mover();
  }

  // region Graphics


  private getPointContainer(points: Array<PIXI.Point>, pointRadius: number): PIXI.DisplayObject {
    this.dragStates = {};
    const container = new PIXI.Container();
    points.forEach((p, i) => {
      const tmpPoint = this.getPointGraphic(p.x, p.y, pointRadius);
      tmpPoint.name = this.pointNamePrefix + i;
      this.registerPointEvents(tmpPoint);
      container.addChild(tmpPoint);
    });
    return container;
  }

  private getLineContainer(points: Array<PIXI.Point>, lineWidth: number): PIXI.DisplayObject {
    const container = new PIXI.Container();
    const g = new PIXI.Graphics();
    g.lineStyle(lineWidth, 0xffd900, 1);
    points.forEach(p => {
      g.moveTo(p.x, p.y);
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
    const pContainer = this.getPointContainer(info.points, info.pointRadius);
    pContainer.name = 'points';
    const lContainer = this.getLineContainer(info.points, info.lineWidth);
    lContainer.name = 'lines';
    const toDeleteL = this.GContainer.getChildByName('lines');
    const toDeleteP = this.GContainer.getChildByName('points');
    this.GContainer.removeChild(toDeleteL);
    this.GContainer.removeChild(toDeleteP);
    this.GContainer.addChild(pContainer);
    this.GContainer.addChild(lContainer);
    this.registerEvents();
    if (render) {
      this.OnRequestRender.next();
    }
  }

  // endregion

  // region Scaling And Move handling

  private handleScaling(event: ScalingEvent) {

  }

  private handleMove(moveEvent: MoveDelta) {

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
    point.addListener('pointermove', event1 => {
      if (!this.dragStates[event1.currentTarget.name]) {
        return;
      }

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
