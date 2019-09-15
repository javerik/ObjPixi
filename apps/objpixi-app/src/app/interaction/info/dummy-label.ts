import * as PIXI from 'pixi.js';
import {ILabel} from '../../interface/info/ilabel';
import {Subject} from 'rxjs';

export class DummyLabel implements ILabel {
  OnInitialized: Subject<PIXI.DisplayObject>;
  OnRequestRender: Subject<null>;

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
}
