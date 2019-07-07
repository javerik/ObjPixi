import * as PIXI from 'pixi.js';
import {ScaleArrow} from './objects/scale-arrow';
import {Subject} from 'rxjs';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';
import {ScalingDelta, ScalingEvent} from '../../interface/events/scaling-event';
import {IScaler, ScalerInfo} from '../../interface/iscaler';


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


export class BasicScaler implements IScaler {

  Arrows: ScalingArrows;
  Positions: ArrowPositions;
  Container: PIXI.Container;
  private deltas: Array<ScalingDelta>;
  protected ScalingInfo: ScalerInfo;
  public OnCreated: Subject<PIXI.DisplayObject>;
  public OnRequestRender: Subject<null>;
  public OnScaleEvent: Subject<ScalingEvent>;

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnScaleEvent = new Subject();
    this.deltas = [
      {delta: new PIXI.Point(0, 0), direction: ScaleDirection.Up},
      {delta: new PIXI.Point(0, 0), direction: ScaleDirection.Left},
      {delta: new PIXI.Point(0, 0), direction: ScaleDirection.Right},
      {delta: new PIXI.Point(0, 0), direction: ScaleDirection.Down},
    ];
  }

  private DragStates = {
    Top: false,
    Left: false,
    Right: false,
    Bottom: false,
  };

  // region Init

  FromBounding() {
    this.Arrows = {
      Top: new ScaleArrow(ScaleDirection.Up),
      Bottom: new ScaleArrow(ScaleDirection.Down),
      Left: new ScaleArrow(ScaleDirection.Left),
      Right: new ScaleArrow(ScaleDirection.Right)
    };
    this.generatePoints();
    this.initArrows();
    this.Container = new PIXI.Container();
    this.Container.addChild(this.Arrows.Right.DispObj);
    this.Container.addChild(this.Arrows.Bottom.DispObj);
    this.Container.addChild(this.Arrows.Left.DispObj);
    this.Container.addChild(this.Arrows.Top.DispObj);
    this.Container.visible = false;
    this.registerEvents();
  }

  private initArrows() {
    this.Arrows.Right.Init(this.Positions.Right.x, this.Positions.Right.y);
    this.Arrows.Bottom.Init(this.Positions.Bottom.x, this.Positions.Bottom.y);
    this.Arrows.Left.Init(this.Positions.Left.x, this.Positions.Left.y);
    this.Arrows.Top.Init(this.Positions.Top.x, this.Positions.Top.y);
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
      const delta = this.getDeltePos(ScaleDirection.Right, newPos);
      console.log(delta);
      this.reCalculatePositions();
      this.deltas[2].delta = delta;
      this.OnScaleEvent.next({deltas: this.deltas, direction: ScaleDirection.Right});
    });
    this.Arrows.Bottom.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Bottom) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Bottom.DispObj.y = newPos.y;
      const delta = this.getDeltePos(ScaleDirection.Down, newPos);
      this.reCalculatePositions();
      this.deltas[3].delta = delta;
      this.OnScaleEvent.next({deltas: this.deltas, direction: ScaleDirection.Down});
    });
    this.Arrows.Left.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Left) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Left.DispObj.x = newPos.x;
      const delta = this.getDeltePos(ScaleDirection.Left, newPos);
      this.reCalculatePositions();
      this.deltas[1].delta = delta;
      this.OnScaleEvent.next({deltas: this.deltas, direction: ScaleDirection.Left});
    });
    this.Arrows.Top.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Top) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Top.DispObj.y = newPos.y;
      const delta = this.getDeltePos(ScaleDirection.Up, newPos);
      this.reCalculatePositions();
      this.deltas[0].delta = delta;
      this.OnScaleEvent.next({deltas: this.deltas, direction: ScaleDirection.Up});
    });
    // endregion

  }

  // endregion

  // region point calculations
  private generatePoints(): void {
    const bounding = this.ScalingInfo.obj.getBounds();
    const offset = this.ScalingInfo.offset;
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

  private reCalculatePositions() {
    const y = this.Arrows.Top.DispObj.y - ((this.Arrows.Top.DispObj.y - this.Arrows.Bottom.DispObj.y) / 2);
    const x = this.Arrows.Left.DispObj.x + ((this.Arrows.Right.DispObj.x - this.Arrows.Left.DispObj.x) / 2);
    this.Arrows.Left.DispObj.y = y;
    this.Arrows.Right.DispObj.y = y;
    this.Arrows.Top.DispObj.x = x;
    this.Arrows.Bottom.DispObj.x = x;
  }

  private getDeltePos(direction: ScaleDirection, newPos: PIXI.Point): PIXI.Point {
    const delta = new PIXI.Point();
    switch (direction) {
      case ScaleDirection.Up:
        delta.y = this.Positions.Top.y - newPos.y;
        break;
      case ScaleDirection.Down:
        delta.y = newPos.y - this.Positions.Bottom.y;
        break;
      case ScaleDirection.Left:
        delta.x = this.Positions.Left.x - newPos.x;
        break;
      case ScaleDirection.Right:
        delta.x = newPos.x - this.Positions.Right.x;
        break;
    }
    return delta;
  }

  // endregion

  // region IScaler
  Generate(info: ScalerInfo) {
    this.ScalingInfo = info;
    this.FromBounding();
  }

  SetVisibility(visible: boolean) {
    this.Container.visible = visible;
    this.OnRequestRender.next();
  }

  GetObject(): PIXI.DisplayObject {
    return this.Container;
  }

  // endregion

}
