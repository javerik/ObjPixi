import * as PIXI from 'pixi.js';
import {ILabel} from '../../interface/info/ilabel';
import {Subject} from 'rxjs';
import {DummyLabel} from '../../interaction/info/dummy-label';
import {Mover} from '../../interaction/moving/mover';

export class ExampleLabel extends DummyLabel implements ILabel {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;
  private text = 'N/A';
  private readonly container: PIXI.Container;
  private readonly gContainer: PIXI.Container;
  private readonly interActionContainer: PIXI.Container;
  private readonly mover: Mover;
  private textObj: PIXI.Text;
  private readonly widthOffset = 10;
  private initialized = false;
  private OriginPoint: PIXI.Point;
  private Offset: PIXI.Point = new PIXI.Point(0, 0);

  constructor() {
    super();
    this.container = new PIXI.Container();
    this.gContainer = new PIXI.Container();
    this.interActionContainer = new PIXI.Container();
    this.mover = new Mover();
  }

  // region Graphic
  private createRect(): PIXI.DisplayObject {
    const g = new PIXI.Graphics();
    g.beginFill(0x546e7a, 0.7);
    g.drawRoundedRect(0, 0, this.textObj.width + this.widthOffset, this.textObj.height, 8);
    g.endFill();
    return g;
  }

  // endregion

  // region events
  private registerEvents() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    this.mover.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
    this.mover.OnMoved.subscribe(value => {
      this.Offset.x += value.x;
      this.Offset.y += value.y;
      this.setPosition();
      this.OnRequestRender.next();
    });
    this.mover.OnMoveEnd.subscribe(value => {
      this.interActionContainer.visible = false;
      this.OnRequestRender.next();
    });
    this.registerContainerEvents(this.container);
  }

  private registerContainerEvents(container: PIXI.DisplayObject) {
    container.interactive = true;
    container.buttonMode = true;
    container.on('click', event1 => {
      this.interActionContainer.visible = true;
      this.OnRequestRender.next();
    });
    container.on('tap', event1 => {
      this.interActionContainer.visible = true;
      this.OnRequestRender.next();
    });
  }

  // endregion

  // region Init
  private reInit() {
    this.container.removeChildren();
    this.gContainer.removeChildren();
    this.textObj = new PIXI.Text(this.text);
    this.textObj.anchor.set(0.5, 0.5);
    const g = this.createRect();
    this.textObj.x = (this.textObj.width + this.widthOffset) / 2;
    this.textObj.y = this.textObj.height / 2;
    this.gContainer.addChild(g);
    this.gContainer.addChild(this.textObj);
    this.container.addChild(this.gContainer);
    this.container.addChild(this.interActionContainer);
  }

  private setPosition() {
    const x = this.OriginPoint.x + this.Offset.x;
    const y = this.OriginPoint.y + this.Offset.y;
    this.gContainer.x = x;
    this.gContainer.y = y;
  }

  // endregion

  // region ILabel

  EnableControls(state: boolean): void {
  }

  Init(name?: string): void {
    if (name !== undefined) {
      this.text = name;
    }
    this.reInit();
    this.interActionContainer.removeChildren();
    this.mover.Generate(this.container.getBounds());
    this.mover.SetVisibility(true);
    this.interActionContainer.addChild(this.mover.GetObject());
    this.interActionContainer.visible = false;
    this.registerEvents();
    this.OnInitialized.next(this.container);
  }

  ClearSelection() {
    this.interActionContainer.visible = false;
    this.OnRequestRender.next();
  }

  SetText(text: string) {
    this.text = text;
    this.reInit();
    this.mover.recenter(this.gContainer.getBounds());
    this.OnRequestRender.next();
  }

  SetVisible(state: boolean): void {
    this.container.visible = state;
  }

  SetOriginPosition(point: PIXI.Point) {
    this.OriginPoint = point;
    this.setPosition();
    this.mover.recenter(this.gContainer.getBounds());
  }

  // endregion
}
