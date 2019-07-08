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
  private lastPositions: Array<ScalingDelta>;
  protected ScalingInfo: ScalerInfo;
  public OnCreated: Subject<PIXI.DisplayObject>;
  public OnRequestRender: Subject<null>;
  public OnScaleEvent: Subject<ScalingEvent>;

  constructor() {
    this.OnRequestRender = new Subject();
    this.OnScaleEvent = new Subject();
    this.deltas = [
      {point: new PIXI.Point(0, 0), dir: ScaleDirection.Up},
      {point: new PIXI.Point(0, 0), dir: ScaleDirection.Left},
      {point: new PIXI.Point(0, 0), dir: ScaleDirection.Right},
      {point: new PIXI.Point(0, 0), dir: ScaleDirection.Down},
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
    this.Container.zIndex = 10;
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
      this.reCalculatePositions();
      this.deltas[2].point = delta;
      this.OnScaleEvent.next({delta, direction: ScaleDirection.Right, ArrowPositions: this.lastPositions});
    });
    this.Arrows.Bottom.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Bottom) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Bottom.DispObj.y = newPos.y;
      const delta = this.getDeltePos(ScaleDirection.Down, newPos);
      this.reCalculatePositions();
      this.deltas[3].point = delta;
      this.OnScaleEvent.next({delta, direction: ScaleDirection.Down, ArrowPositions: this.lastPositions});
    });
    this.Arrows.Left.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Left) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Left.DispObj.x = newPos.x;
      const delta = this.getDeltePos(ScaleDirection.Left, newPos);
      console.log(delta);
      this.reCalculatePositions();
      this.deltas[1].point = delta;
      this.OnScaleEvent.next({delta, direction: ScaleDirection.Left, ArrowPositions: this.lastPositions});
    });
    this.Arrows.Top.DispObj.on('pointermove', event1 => {
      if (!this.DragStates.Top) {
        return;
      }
      const newPos = event1.data.getLocalPosition(event1.currentTarget.parent);
      this.Arrows.Top.DispObj.y = newPos.y;
      const delta = this.getDeltePos(ScaleDirection.Up, newPos);
      this.reCalculatePositions();
      this.deltas[0].point = delta;
      this.OnScaleEvent.next({delta, direction: ScaleDirection.Up, ArrowPositions: this.lastPositions});
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
    this.lastPositions = [
      {dir: ScaleDirection.Right, point: new PIXI.Point(this.Positions.Right.x, this.Positions.Right.y)},
      {dir: ScaleDirection.Left, point: new PIXI.Point(this.Positions.Left.x, this.Positions.Left.y)},
      {dir: ScaleDirection.Up, point: new PIXI.Point(this.Positions.Top.x, this.Positions.Top.y)},
      {dir: ScaleDirection.Down, point: new PIXI.Point(this.Positions.Bottom.x, this.Positions.Bottom.y)},
    ];
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
    const idx = this.lastPositions.findIndex(value => value.dir === direction);
    switch (direction) {
      case ScaleDirection.Up:
      case ScaleDirection.Down:
        delta.y = newPos.y - this.lastPositions[idx].point.y;
        this.lastPositions[idx].point.y = newPos.y;
        break;
      case ScaleDirection.Left:
      case ScaleDirection.Right:
        delta.x = newPos.x - this.lastPositions[idx].point.x;
        this.lastPositions[idx].point.x = newPos.x;
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

  Regenerate(info: ScalerInfo) {
    this.ScalingInfo = info;
    this.generatePoints();
    this.Arrows.Bottom.DispObj.x = this.Positions.Bottom.x;
    this.Arrows.Bottom.DispObj.y = this.Positions.Bottom.y;

    this.Arrows.Left.DispObj.x = this.Positions.Left.x;
    this.Arrows.Left.DispObj.y = this.Positions.Left.y;

    this.Arrows.Right.DispObj.x = this.Positions.Right.x;
    this.Arrows.Right.DispObj.y = this.Positions.Right.y;

    this.Arrows.Top.DispObj.x = this.Positions.Top.x;
    this.Arrows.Top.DispObj.y = this.Positions.Top.y;

  }

  // endregion

}
