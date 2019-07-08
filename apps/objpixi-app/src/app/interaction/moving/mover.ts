import * as PIXI from 'pixi.js';
import {Subject} from 'rxjs';

export class Mover {
  private static Texture: PIXI.Texture;
  private readonly Icon = 'assets/arrows/arrow_move.png';
  private Container: PIXI.Container;
  private originPoint: PIXI.Rectangle;
  private originPosition = new PIXI.Point();
  private crossSprite: PIXI.DisplayObject;
  private dragMode = false;
  public OnRequestRender: Subject<null>;
  public OnMoved: Subject<MoveDelta>;

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnMoved = new Subject();
  }

  public Generate(rect: PIXI.Rectangle) {
    if (Mover.Texture === undefined) {
      Mover.Texture = PIXI.Texture.from(this.Icon);
    }
    this.Container = new PIXI.Container();
    this.Container.visible = false;
    this.originPoint = rect;
    const sprite = new PIXI.Sprite(Mover.Texture);
    sprite.anchor.set(0.5, 0.5);
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.x = this.originPoint.x + (this.originPoint.width / 2);
    sprite.y = this.originPoint.y + (this.originPoint.height / 2);
    sprite.zIndex = 10;
    sprite.angle = 45;
    this.originPosition.set(sprite.x, sprite.y);
    this.crossSprite = sprite;
    this.registerEvents();
    this.Container.addChild(this.crossSprite);
    this.OnRequestRender.next();
  }

  public GetObject(): PIXI.DisplayObject {
    return this.Container;
  }

  public SetVisibility(visible: boolean) {
    this.Container.visible = visible;
    this.OnRequestRender.next();
  }

  // region Init
  private registerEvents() {
    this.crossSprite.on('pointerdown', event1 => {
      this.dragMode = true;
    });
    this.crossSprite.on('pointerup', event1 => {
      this.dragMode = false;
    });
    this.crossSprite.on('pointerupoutside', event1 => {
      this.dragMode = false;
    });
    this.crossSprite.on('pointermove', event1 => {
      if (!this.dragMode) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      const moveDelta: MoveDelta = {
        x: newPos.x - this.originPosition.x,
        y: newPos.y - this.originPosition.y
      };
      this.crossSprite.x = this.originPosition.x + moveDelta.x;
      this.crossSprite.y = this.originPosition.y + moveDelta.y;
      this.OnMoved.next(moveDelta);
      this.OnRequestRender.next();
    });
  }

  // endregion

  // region Point calculations

  // endregion

}

export interface MoveDelta {
  x: number;
  y: number;
}
