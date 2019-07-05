import * as PIXI from 'pixi.js';


export interface IGeometry {
  GetId(): string;
  GetName(): string;
  SetName(name: string);
  GetObject(): PIXI.DisplayObject;
}
