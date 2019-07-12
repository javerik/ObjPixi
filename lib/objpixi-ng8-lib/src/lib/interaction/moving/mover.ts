import * as PIXI from 'pixi.js';
import {Subject} from 'rxjs';

export class Mover {
  private static Texture: PIXI.Texture = null;
  private readonly Icon = 'assets/arrows/arrow_move.png';
  private Container: PIXI.Container;
  private originPoint: PIXI.Rectangle;
  private originPosition = new PIXI.Point();
  private crossSprite: PIXI.DisplayObject;
  private dragMode = false;
  private lastPosition: PIXI.Point;
  public OnRequestRender: Subject<null>;
  public OnMoved: Subject<MoveDelta>;
  public OnMoveEnd: Subject<null>;

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnMoved = new Subject();
    this.OnMoveEnd = new Subject();
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
    sprite.zIndex = 10;
    sprite.angle = 45;
    this.crossSprite = sprite;
    this.centerSprite();
    this.registerEvents();
    this.Container.addChild(this.crossSprite);
    this.OnRequestRender.next();
  }

  private centerSprite() {
    this.crossSprite.x = this.originPoint.x + (this.originPoint.width / 2);
    this.crossSprite.y = this.originPoint.y + (this.originPoint.height / 2);
    this.originPosition.set(this.crossSprite.x, this.crossSprite.y);
    this.lastPosition = this.originPosition;
  }

  public recenter(rect: PIXI.Rectangle) {
    this.originPoint = rect;
    this.centerSprite();
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
      this.OnMoveEnd.next();
    });
    this.crossSprite.on('pointerupoutside', event1 => {
      this.dragMode = false;
      this.OnMoveEnd.next();
    });
    this.crossSprite.on('pointermove', event1 => {
      if (!this.dragMode) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      const moveDelta: MoveDelta = {
        x: newPos.x - this.lastPosition.x,
        y: newPos.y - this.lastPosition.y
      };
      this.lastPosition = newPos;
      this.crossSprite.x += moveDelta.x;
      this.crossSprite.y += moveDelta.y;
      this.OnMoved.next();
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
