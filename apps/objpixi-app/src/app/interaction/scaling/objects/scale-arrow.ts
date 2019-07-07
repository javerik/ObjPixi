import * as PIXI from 'pixi.js';
import {ScaleDirection} from '../../../interface/enums/scale-direction.enum';


export class ScaleArrow {
  private static Texture: PIXI.Texture;
  private static TextureLoader: PIXI.Loader;
  private readonly Icon = 'assets/arrow_down.png';
  private readonly direction: ScaleDirection;

  public DispObj: PIXI.DisplayObject;

  constructor(direction: ScaleDirection) {
    this.direction = direction;
  }

  public Init(posX, posY) {
    if (ScaleArrow.Texture === undefined) {
      ScaleArrow.Texture = PIXI.Texture.from(this.Icon);
    }
    const sp = new PIXI.Sprite(ScaleArrow.Texture);
    sp.anchor.set(0.5);
    sp.x = posX;
    sp.y = posY;

    switch (this.direction) {
      case ScaleDirection.Up:
        sp.angle = 180;
        break;
      case ScaleDirection.Down:
        break;
      case ScaleDirection.Left:
        sp.angle = 90;
        break;
      case ScaleDirection.Right:
        sp.angle = -90;
        break;
    }
    this.DispObj = sp;
    this.DispObj.interactive = true;
    this.DispObj.buttonMode = true;
  }

}

