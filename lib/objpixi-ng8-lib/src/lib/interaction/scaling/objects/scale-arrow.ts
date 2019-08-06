import * as PIXI from 'pixi.js';
import {ScaleDirection} from '../../../interface/enums/scale-direction.enum';
import {TextureManager} from '../../../utils/texture-manager';


export class ScaleArrow {
  public static TextureIds = [{id: '_INT_SCALER_ARROW_', url: 'assets/arrows/arrow_move.png'}];
  private readonly Icon = 'assets/arrows/arrow_down.png';
  private readonly direction: ScaleDirection;

  public DispObj: PIXI.DisplayObject;

  constructor(direction: ScaleDirection) {
    this.direction = direction;
  }

  public Init(posX, posY) {
    if (TextureManager.Retrieve(ScaleArrow.TextureIds[0].id)) {
      return;
    }
    const sp = new PIXI.Sprite(TextureManager.Retrieve(ScaleArrow.TextureIds[0].id));
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

