import * as PIXI from 'pixi.js';
import {ScaleArrow, ScaleArrowDirection} from './objects/scale-arrow';
import {Subject} from 'rxjs';


export interface ScalingArrows {
  Top: ScaleArrow;
  Right: ScaleArrow;
  Bottom: ScaleArrow;
  Left: ScaleArrow;
}


export class BasicScaler {

  Arrows: ScalingArrows;
  Container: PIXI.Container;
  public OnCreated: Subject<PIXI.DisplayObject>;

  FromBounding(bounding: PIXI.Rectangle, offset = 0) {

    this.Arrows = {
      Top: new ScaleArrow(ScaleArrowDirection.Up),
      Bottom: new ScaleArrow(ScaleArrowDirection.Down),
      Left: new ScaleArrow(ScaleArrowDirection.Left),
      Right: new ScaleArrow(ScaleArrowDirection.Right)
    };

    // Top
    const posTop = {
      x: bounding.x + bounding.width / 2,
      y: bounding.y - offset
    };

    const posRight = {
      x: bounding.x + bounding.width + offset,
      y: bounding.y + bounding.height / 2
    };

    const posBottom = {
      x: bounding.x + bounding.width / 2,
      y: bounding.y + bounding.height + offset
    };

    const posLeft = {
      x: bounding.x - offset,
      y: bounding.y + bounding.height / 2
    };

    this.Arrows.Right.Init(posRight.x, posRight.y);
    this.Arrows.Bottom.Init(posBottom.x, posBottom.y);
    this.Arrows.Left.Init(posLeft.x, posLeft.y);
    this.Arrows.Top.Init(posTop.x, posTop.y);
    this.Container = new PIXI.Container();
  }


}
