import {BaseGeo} from '../base-geo';
import {IGeometry} from '../../interface/igeometry';
import {IScaler} from '../../interface/iscaler';
import * as PIXI from 'pixi.js';
import {PointInfo} from './point-info';

export class Point extends BaseGeo implements IGeometry {

  // region Statics
  private static pointTexture: PIXI.Texture;
  // endregion

  // region Helper
  Scaler: IScaler;
  // endregion

  // region Member
  private MainDisObject: PIXI.Container;
  private pointSprite: PIXI.Sprite;
  private info: PointInfo;
  // endregion

  // region Read only variables
  private readonly icon = 'assets/point/point_big.png';
  // endregion

  // region States
  private dragState = false;
  // endregion

  constructor(pointInfo: PointInfo, name?: string) {
    super(name);
    Point.pointTexture = PIXI.Texture.from(this.icon);
    this.info = pointInfo;
  }

  // region Events
  private registerEvents(obj: PIXI.DisplayObject) {
    obj.addListener('click', event1 => {
      this.OnInteraction.next({event: event1, target: this});
    });
    obj.addListener('pointerdown', event1 => {
        this.dragState = true;
    });
    obj.addListener('pointerup', event1 => {
        this.dragState = false;
    });
    obj.addListener('pointerupoutside', event1 => {
      this.dragState = false;
    });
    obj.addListener('pointermove', event1 => {
      if (!this.dragState) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.pointSprite.position.x = newPos.x;
      this.pointSprite.position.y = newPos.y;
      this.OnRequestRender.next();
    });
  }
  // endregion

  // region IGeometry

  Init(): void {
    if (Point.pointTexture === undefined) {
      setTimeout(() => {
        this.Init();
      }, 100);
      return;
    }
    this.MainDisObject = new PIXI.Container();
    this.pointSprite = new PIXI.Sprite(Point.pointTexture);
    this.pointSprite.anchor.set(0.5, 0.5);
    this.pointSprite.position.x = this.info.position.x;
    this.pointSprite.position.y = this.info.position.y;
    this.pointSprite.interactive = true;
    this.pointSprite.buttonMode = true;
    this.registerEvents(this.pointSprite);
    this.MainDisObject.addChild(this.pointSprite);
    this.OnInitialized.next(this.MainDisObject);
  }

  ClearSelection(): void {
    this.dragState = false;
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
