import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js';
import {Rect} from '../../geometries/Rect/rect';
import {GeoEvent} from '../../geometries/base-geo';
import {ScaleArrow} from '../../interaction/scaling/objects/scale-arrow';
import {MatGridTile} from '@angular/material';
import {BasicScaler} from '../../interaction/scaling/basic-scaler';
import {ScaleDirection} from '../../interface/enums/scale-direction.enum';
import {IGeometry} from '../../interface/igeometry';
import {Ellipse} from '../../geometries/Ellipse/ellipse';


@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit, AfterViewInit {

  @ViewChild('pixiContainer', {static: false}) pixiContainer: ElementRef;
  @ViewChild('tilePixi', {static: false}) tilePixi: MatGridTile;
  App: PIXI.Application;
  Renderer: PIXI.Renderer;
  Stage: PIXI.Container;
  myArrow: ScaleArrow;
  ScaleValue: number;
  ScalingRect: BasicScaler = new BasicScaler();
  Geometries: Array<IGeometry> = [];

  private ratio: number;
  private winWidth = 800;
  private winHeight = 600;

  constructor() {
  }

  static mapRange(val, inMin, inMax, outMin, outMax): number {
    return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  ngOnInit() {
    this.Renderer = PIXI.autoDetectRenderer({width: 800, height: 600});
    this.App = new PIXI.Application({width: 800, height: 600});
    this.ratio = 800 / 600;
    this.Stage = new PIXI.Container();
    this.Stage.x = 0;
    this.Stage.y = 0;
    this.Stage.width = 800;
    this.Stage.height = 600;
    this.Stage.interactive = true;
    this.Stage.buttonMode = true;
    this.ScalingRect.OnRequestRender.subscribe(() => {
      this.ForceRender();
    });
  }

  ngAfterViewInit(): void {
    this.pixiContainer.nativeElement.appendChild(this.Renderer.view);
    this.Renderer.render(this.Stage);
    // this.App.stage.addChild(this.Stage);
  }

  onTileResize(event) {
    // @ts-ignore
    const w = this.tilePixi._element.nativeElement.offsetWidth;
    // @ts-ignore
    const h = this.tilePixi._element.nativeElement.offsetHeight;

    const lastWidth = this.winWidth;
    const lastHeight = this.winHeight;

    if (w / h >= this.ratio) {
      this.winWidth = window.innerHeight * this.ratio;
      this.winHeight = window.innerHeight;
    } else {
      this.winWidth = window.innerWidth;
      this.winHeight = window.innerWidth / this.ratio;
    }
    if (this.winWidth > 800) {
      this.winWidth = 800;
    }
    if (this.winHeight > 600) {
      this.winHeight = 600;
    }

    const fX = BasicComponent.mapRange(this.winWidth / (800 / 100), 0, 100, -1, 1);
    const fY = BasicComponent.mapRange(this.winHeight / (600 / 100), 0, 100, -1, 1);
    // console.log('W: %d H:%d fX: %f fY: %f', this.winWidth, this.winHeight, fX, fY);
    this.App.renderer.resize(this.winWidth, this.winHeight);
    // this.Stage.scale.set(fX, fY);
    console.log('Stage: x: %d y: %d', this.Stage.x, this.Stage.y);
    this.Renderer.view.style.width = this.winWidth + 'px';
    this.Renderer.view.style.height = this.winHeight + 'px';
    this.Renderer.render(this.Stage);
    // this.App.render();
  }

  onAddRect() {
    const newRect = new Rect({width: 100, height: 100, center: true, position: new PIXI.Point(400, 300)});
    this.registerGeoEvents(newRect);
    newRect.Init();
    this.Geometries.push(newRect);
  }

  onAddEllipse() {
    const newEllipse = new Ellipse({width: 100, height: 150, center: true, position: new PIXI.Point(400, 300)});
    this.registerGeoEvents(newEllipse);
    newEllipse.Init();
    this.Geometries.push(newEllipse);
  }

  private registerGeoEvents(geo: IGeometry) {
    geo.OnRequestRender.subscribe({
      next: value => {
        this.ForceRender();
      }
    });
    geo.OnInitialized.subscribe({
      next: value => {
        this.onAddObject(value);
      }
    });
    geo.OnInteraction.subscribe({
      next: value => {
        this.onObjectEvent(value);
      }
    });
  }

  onAddArrow() {
    this.myArrow = new ScaleArrow(ScaleDirection.Left);
    this.myArrow.Init(100, 100);
    this.onAddObject(this.myArrow.DispObj);
  }

  onScaleStage() {
    this.Stage.scale.set(this.ScaleValue);
  }

  onAddObject(obj: PIXI.DisplayObject) {
    this.Stage.addChild(obj);
    this.Renderer.render(this.Stage);
    setTimeout(() => {
      this.Renderer.render(this.Stage);
    }, 10);
  }

  ForceRender() {
    this.Renderer.render(this.Stage);
  }


  onObjectEvent(event: GeoEvent) {
    console.log('Event from [%s]- %s type: %s', event.target.GetId(), event.target.GetName(), event.event.type);

    switch (event.event.type) {
      case 'click':
        this.clearExcept(event.target.GetId());
        break;
    }
  }

  private clearExcept(id: string) {
    this.Geometries.filter(value => value.GetId() !== id).forEach(value => {
      value.ClearSelection();
    });
  }

}
