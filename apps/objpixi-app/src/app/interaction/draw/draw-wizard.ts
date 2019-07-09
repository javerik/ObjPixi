import * as PIXI from 'pixi.js';


export class DrawWizard {
  private drawContainer: PIXI.Container;

  constructor() {
  }

  public Init(w, h, callback: (object: PIXI.DisplayObject) => void) {
    this.drawContainer = new PIXI.Container();
    this.drawContainer.x = 0;
    this.drawContainer.y = 0;
    this.drawContainer.width = w;
    this.drawContainer.height = h;
    this.drawContainer.hitArea = new PIXI.Rectangle(0, 0, w, h);
    this.drawContainer.interactive = true;
    this.drawContainer.buttonMode = true;
    this.registerEvents(this.drawContainer);
    callback(this.drawContainer);
  }

  private registerEvents(obj: PIXI.DisplayObject) {
    obj.addListener('tap', event1 => {
      console.log('Tap');
    });
    obj.addListener('click', event1 => {
      console.log('Click');
    });
  }

}
