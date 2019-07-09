import * as PIXI from 'pixi.js';
import {IGeometry} from '../../../interface/igeometry';
import {PolyInfo} from '../poly-info';
import {PolyBase} from '../poly-base';

export class PolyLine extends PolyBase implements IGeometry {
  private readonly scalerOffset = 15;

  constructor(polyInfo: PolyInfo, name?: string) {
    super(polyInfo, name);
  }

  // region Graphics


  private getLineContainer(points: Array<PIXI.Point>, lineWidth: number): PIXI.Container {
    const container = new PIXI.Container();
    container.name = this.cNameLines;
    const g = new PIXI.Graphics();
    g.lineStyle(lineWidth, 0xffd900, 1);
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
    const lContainer = this.getLineContainer(info.points, info.lineWidth);
    lContainer.zIndex = 3;
    const toDeleteL = this.GContainer.getChildByName(this.cNameLines);
    this.GContainer.removeChild(toDeleteL);
    this.GContainer.addChild(lContainer);
    this.GContainer.setChildIndex(lContainer, 0);
    this.createHitArea(lContainer);
  }

  // endregion


  // region Events

  protected registerContainerEvents(container: PIXI.DisplayObject) {
    container.addListener('click', event1 => {
      this.GContainer.getChildByName(this.cNamePoint).visible = true;
      this.Mover.SetVisibility(true);
      this.OnInteraction.next({event: event1, target: this});
      this.OnRequestRender.next();
    });
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
    });
  }

// endregion

  // region IGeometry

  Init(): void {
    const container = new PIXI.Container();
    this.GContainer = new PIXI.Container();
    const points = this.getPointContainer(this.info.points, this.info.pointRadius);
    points.visible = false;
    const lines = this.getLineContainer(this.info.points, this.info.lineWidth);
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

  // endregion
}
