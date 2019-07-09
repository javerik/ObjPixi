import * as PIXI from 'pixi.js';
import {IGeometry} from '../../../interface/igeometry';
import {PolyInfo} from '../poly-info';
import {PolyBase} from '../poly-base';


export class PolyGon extends PolyBase implements IGeometry {

  constructor(polyInfo: PolyInfo, name?: string) {
    super(polyInfo, name);
  }

  // region Graphics

  private getPolygonGraphic(points: Array<PIXI.Point>): PIXI.Container {
    const container = new PIXI.Container();
    container.name = this.cNamePolygon;
    const g = new PIXI.Graphics();
    g.beginFill(0xff8a50, 0.7);
    g.drawPolygon(points);
    g.endFill();
    container.addChild(g);
    return container;
  }


  protected refreshGraphic(info: PolyInfo, render: boolean = true) {
    this.refreshPolygon(info);
    super.refreshGraphic(info, render);
  }

  private refreshPolygon(info: PolyInfo) {
    const pContainer = this.getPolygonGraphic(info.points);
    const toDelete = this.GContainer.getChildByName(this.cNamePolygon);
    this.GContainer.removeChild(toDelete);
    this.GContainer.addChild(pContainer);
    this.GContainer.setChildIndex(pContainer, 0);
    this.createHitArea(pContainer);
  }

  // endregion

  // region Events

  protected registerContainerEvents(container: PIXI.DisplayObject) {
    super.registerContainerEvents(container);
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
      this.refreshPolygon(this.info);
      this.Mover.recenter(this.GContainer.getBounds());
      this.OnRequestRender.next();
    });
  }

// endregion

  // region IGeometry

  Init(): void {
    this.GContainer = new PIXI.Container();
    const container = new PIXI.Container();
    const points = this.getPointContainer(this.info.points, this.info.pointRadius);
    points.visible = false;
    const poly = this.getPolygonGraphic(this.info.points);
    this.createHitArea(poly);
    this.GContainer.addChild(poly);
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
