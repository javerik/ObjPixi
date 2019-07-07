import * as PIXI from 'pixi.js';
import {ScaleArrow, ScaleArrowDirection} from './objects/scale-arrow';
import {Subject} from 'rxjs';


export interface ScalingArrows {
  Top: ScaleArrow;
  Right: ScaleArrow;
  Bottom: ScaleArrow;
  Left: ScaleArrow;
}

interface PositionPoint {
  x: number;
  y: number;
}

interface ArrowPositions {
  Top: PositionPoint;
  Left: PositionPoint;
  Right: PositionPoint;
  Bottom: PositionPoint;
}

export class BasicScaler {

  Arrows: ScalingArrows;
  Positions: ArrowPositions;
  Container: PIXI.Container;
  public OnCreated: Subject<PIXI.DisplayObject>;

  private DragStates = {
    Top: false,
    Left: false,
    Right: false,
    Bottom: false,
  };

  FromBounding(bounding: PIXI.Rectangle, offset = 0) {
    this.Arrows = {
      Top: new ScaleArrow(ScaleArrowDirection.Up),
      Bottom: new ScaleArrow(ScaleArrowDirection.Down),
      Left: new ScaleArrow(ScaleArrowDirection.Left),
      Right: new ScaleArrow(ScaleArrowDirection.Right)
    };
    this.generatePoints(bounding, offset);
    this.initArrows();
    this.Container = new PIXI.Container();
    this.Container.addChild(this.Arrows.Right.DispObj);
    this.Container.addChild(this.Arrows.Bottom.DispObj);
    this.Container.addChild(this.Arrows.Left.DispObj);
    this.Container.addChild(this.Arrows.Top.DispObj);
    this.registerEvents();
  }

  private registerEvents() {
    this.Arrows.Right.DispObj.on('click', event1 => {
      console.log('Right arrow has benn clicked');
    });
    this.Arrows.Bottom.DispObj.on('click', event1 => {
      console.log('Bottom arrow has benn clicked');
    });
    this.Arrows.Left.DispObj.on('click', event1 => {
      console.log('Left arrow has benn clicked');
    });
    this.Arrows.Top.DispObj.on('click', event1 => {
      console.log('Top arrow has benn clicked');
    });
  }

  private initArrows() {
    this.Arrows.Right.Init(this.Positions.Right.x, this.Positions.Right.y);
    this.Arrows.Bottom.Init(this.Positions.Bottom.x, this.Positions.Bottom.y);
    this.Arrows.Left.Init(this.Positions.Left.x, this.Positions.Left.y);
    this.Arrows.Top.Init(this.Positions.Top.x, this.Positions.Top.y);
  }

  // region point calculations
  private generatePoints(bounding: PIXI.Rectangle, offset): void {
    this.Positions = {
      Bottom: {
        x: bounding.x + bounding.width / 2,
        y: bounding.y + bounding.height + offset
      },
      Left: {
        x: bounding.x - offset,
        y: bounding.y + bounding.height / 2
      },
      Right: {
        x: bounding.x + bounding.width + offset,
        y: bounding.y + bounding.height / 2
      },
      Top: {
        x: bounding.x + bounding.width / 2,
        y: bounding.y - offset
      }
    };
  }
  // endregion

}
