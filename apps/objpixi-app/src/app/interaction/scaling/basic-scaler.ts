import * as PIXI from 'pixi.js';
import {ScaleArrow} from './objects/scale-arrow';
import {Subject} from 'rxjs';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';
import {ScalingEvent} from '../../interface/events/scaling-event';


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
  public OnRequestRender: Subject<null>;
  public OnScaleEvent: Subject<ScalingEvent>;

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnScaleEvent = new Subject();
  }

  private DragStates = {
    Top: false,
    Left: false,
    Right: false,
    Bottom: false,
  };

  FromBounding(bounding: PIXI.Rectangle, offset = 0) {
    this.Arrows = {
      Top: new ScaleArrow(ScaleDirection.Up),
      Bottom: new ScaleArrow(ScaleDirection.Down),
      Left: new ScaleArrow(ScaleDirection.Left),
      Right: new ScaleArrow(ScaleDirection.Right)
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
    // region Pointerdown drag start
    this.Arrows.Right.DispObj.on('pointerdown', event1 => {
      this.DragStates.Right = true;
    });
    this.Arrows.Bottom.DispObj.on('pointerdown', event1 => {
      this.DragStates.Bottom = true;
    });
    this.Arrows.Left.DispObj.on('pointerdown', event1 => {
      this.DragStates.Left = true;
    });
    this.Arrows.Top.DispObj.on('pointerdown', event1 => {
      this.DragStates.Top = true;
    });
    // endregion

    // region Pointerup/outside drag stop
    this.Arrows.Right.DispObj.on('pointerup', event1 => {
      this.DragStates.Right = false;
    });
    this.Arrows.Bottom.DispObj.on('pointerup', event1 => {
      this.DragStates.Bottom = false;
    });
    this.Arrows.Left.DispObj.on('pointerup', event1 => {
      this.DragStates.Left = false;
    });
    this.Arrows.Top.DispObj.on('pointerup', event1 => {
      this.DragStates.Top = false;
    });

    this.Arrows.Right.DispObj.on('pointerupoutside', event1 => {
      this.DragStates.Right = false;
    });
    this.Arrows.Bottom.DispObj.on('pointerupoutside', event1 => {
      this.DragStates.Bottom = false;
    });
    this.Arrows.Left.DispObj.on('pointerupoutside', event1 => {
      this.DragStates.Left = false;
    });
    this.Arrows.Top.DispObj.on('pointerupoutside', event1 => {
      this.DragStates.Top = false;
    });
    // endregion

    // region Move
    this.Arrows.Right.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Right) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Right.DispObj.x = newPos.x;
      this.OnRequestRender.next();
    });
    this.Arrows.Bottom.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Bottom) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Bottom.DispObj.y = newPos.y;
      this.OnRequestRender.next();
    });
    this.Arrows.Left.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Left) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Left.DispObj.x = newPos.x;
      this.OnRequestRender.next();
    });
    this.Arrows.Top.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Top) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Top.DispObj.y = newPos.y;
      const delta = this.getDeltePos('Top', newPos);
      console.log('Delta Y: %f', delta.y);
      this.OnRequestRender.next();
    });
    // endregion

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

  private getDeltePos(arrowType: string, newPos: PIXI.Point): PIXI.Point {
    const delta = new PIXI.Point();
    switch (arrowType) {
      case 'Top':
        delta.y = this.Positions.Top.y - newPos.y;
        break;
    }
    return delta;
  }

  // endregion

}
