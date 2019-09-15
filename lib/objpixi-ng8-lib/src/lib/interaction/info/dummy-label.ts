import * as PIXI from 'pixi.js';
import {ILabel} from '../../interface/info/ilabel';
import {Subject} from 'rxjs';
import {IStyleLabel} from '../../styles/istyle-label';

export class DummyLabel implements ILabel {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;

  protected Offsets: PIXI.Point = new PIXI.Point(0, 0);
  protected Style: IStyleLabel;

  constructor() {
    this.OnInitialized = new Subject();
    this.OnRequestRender = new Subject();
  }

  EnableControls(state: boolean): void {
  }

  Init(): void {
  }

  SetText(text: string) {
  }

  SetVisible(state: boolean): void {
  }

  ClearSelection() {
  }

  SetOriginPosition(point: PIXI.Point) {
  }

  SetOffsets(point: PIXI.Point) {
    this.Offsets = point;
  }

  GetOffsets(): PIXI.Point {
    return this.Offsets;
  }

  GetStyle(): IStyleLabel {
    return this.Style;
  }

  SetStyle(style: IStyleLabel) {
    this.Style = style;
  }
}
