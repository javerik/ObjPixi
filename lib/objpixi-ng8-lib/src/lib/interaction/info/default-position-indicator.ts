import * as PIXI from 'pixi.js';
import {IPositionIndicator} from '../../interface/info/iposition-indicator';
import {Subject} from 'rxjs';
import {PositionIndicatorInfo} from '../../interface/info/position-indicator-info';

export class DefaultPositionIndicator implements IPositionIndicator {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  // region Member
  private container: PIXI.Container;
  private text: PIXI.Text;
  private info: PositionIndicatorInfo;
  private rectInfo = {
    width: 120,
    height: 30,
    radius: 10
  };
  private fontStyle = {
    fontFamily : 'Arial',
    fontSize: 16,
    fill : 'white',
    align : 'right'
  };
  private borders = {
    x: {
      min: 0,
      max: 1980
    },
    y: {
      min: 0,
      max: 1980
    },
  };
  private yOffset = 35;
  // endregion

  constructor() {
    this.OnInitialized = new Subject();
    this.OnRequestRender = new Subject();
  }

  SetBorders(minX, maxX, minY, maxY) {
    this.borders.x.min = minX;
    this.borders.x.max = maxX;
    this.borders.y.min = minY;
    this.borders.y.max = maxY;
  }

  Enable(state: boolean): void {
    this.container.visible = state;
    this.OnRequestRender.next();
  }

  Init(info?: PositionIndicatorInfo): void {
    if (info === undefined) {
      this.createDefaultInfo();
    } else {
      this.info = info;
    }
    this.container = new PIXI.Container();
    const g = this.createGraphic();
    this.text = new PIXI.Text('', this.fontStyle);
    this.text.anchor.set(0.5, 0.5);
    this.text.x = this.rectInfo.width / 2;
    this.text.y = this.rectInfo.height / 2;
    this.container.addChild(g);
    this.container.addChild(this.text);
    if (this.info.lockPosition) {
      this.container.x = this.info.position.x;
      this.container.y = this.info.position.y;
    }
    this.OnInitialized.next(this.container);
  }

  OnEvent(event: PIXI.interaction.InteractionEvent) {
    if (event.type === 'pointermove') {
      const newPos = event.data.getLocalPosition(event.currentTarget.parent);
      let x = newPos.x;
      let y = newPos.y;
      if (x < this.borders.x.min) {
        x = this.borders.x.min;
      } else if(x > this.borders.x.max) {
        x = this.borders.x.max;
      }
      if (y < this.borders.y.min) {
        y = this.borders.y.min;
      } else if(y > this.borders.y.max) {
        y = this.borders.y.max;
      }
      this.text.text = 'X: ' + x.toFixed() + ' Y: ' + y.toFixed();
      if (this.info.moveBox) {
        this.calculatePos(newPos);
      }
      this.OnRequestRender.next();
    }
  }

  private createGraphic(): PIXI.DisplayObject {
    const g = new PIXI.Graphics();
    g.lineStyle(2, 0x000000, 1);
    g.beginFill(0x546e7a, 0.8);
    g.drawRoundedRect(0, 0, this.rectInfo.width, this.rectInfo.height, this.rectInfo.radius);
    g.endFill();
    return g;
  }

  private createDefaultInfo() {
    this.info = {
      lockPosition: false,
      moveBox: true,
      offsets: new PIXI.Point(0, 35),
    };
  }

  private calculatePos(pos: PIXI.Point) {
    const x = pos.x - ((this.rectInfo.width / 2) + this.info.offsets.x);
    const y = pos.y - this.info.offsets.y;
    this.container.x = x;
    this.container.y = y;
  }
}
