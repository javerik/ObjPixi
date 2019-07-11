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
import {PolyLine} from '../../geometries/Poly/Polyline/poly-line';
import {PolyGon} from '../../geometries/Poly/Polygon/poly-gon';
import {Line} from '../../geometries/Line/line';
import {Point} from '../../geometries/Point/point';
import {IStyleLine} from '../../styles/istyle-line';
import {IStyleEllipse} from '../../styles/istyle-ellipse';
import {IStylePoly} from '../../styles/istyle-poly';
import {IStyleRect} from '../../styles/istyle-rect';
import {ChangeEvent} from '../../interface/events/change-event';


@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit, AfterViewInit {

  @ViewChild('pixiContainer', {static: false}) pixiContainer: ElementRef;
  @ViewChild('tilePixi', {static: false}) tilePixi: MatGridTile;
  Renderer: PIXI.Renderer;
  Stage: PIXI.Container;
  myArrow: ScaleArrow;
  ScaleValue: number;
  ScalingRect: BasicScaler = new BasicScaler();
  Geometries: Array<IGeometry> = [];
  dragPointFillColor = 0xf44336;
  defaultLineColor = 0x009688;
  changeEvents: Array<ChangeEvent> = [];
  // region styles

  lineStyle: IStyleLine = {
    alpha: 1,
    color: this.defaultLineColor,
    lineWidth: 3,
    pointStyle: {
      fillStyle: {
        useFill: true,
        useLine: false,
        fillAlpha: 1,
        fillColor: this.dragPointFillColor
      },
      radius: 6
    }
  };
  ellipseStyle: IStyleEllipse = {
    fillStyle: {
      useFill: true,
      useLine: true,
      fillAlpha: 0.5,
      lineAlpha: 1,
      fillColor: 0x7e57c2,
      lineColor: this.defaultLineColor,
      lineWidth: 2
    }
  };
  polyLineStyle: IStylePoly = {
    pointStyle: {
      radius: 6,
      fillStyle: {
        useFill: true,
        useLine: false,
        fillAlpha: 1,
        fillColor: this.dragPointFillColor
      }
    },
    fillStyle: {
      useLine: true,
      useFill: false,
      lineWidth: 2,
      lineColor: this.defaultLineColor,
      lineAlpha: 1
    }
  };
  polyGonStyle: IStylePoly = {
    pointStyle: {
      radius: 6,
      fillStyle: {
        useFill: true,
        useLine: false,
        fillAlpha: 1,
        fillColor: this.dragPointFillColor
      }
    },
    fillStyle: {
      useLine: false,
      useFill: true,
      fillColor: 0x66bb6a,
      fillAlpha: 0.5
    }
  };
  rectStyle: IStyleRect = {
    fillStyle: {
      useFill: true,
      useLine: true,
      fillAlpha: 0.5,
      lineAlpha: 1,
      fillColor: 0x8d6e63,
      lineColor: this.defaultLineColor,
      lineWidth: 2
    }
  };
  // endregion

  private ratio: number;
  private winWidth = 800;
  private winHeight = 600;

  constructor() {
  }

  static mapRange(val, inMin, inMax, outMin, outMax): number {
    return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  }

  ngOnInit() {
    this.Renderer = PIXI.autoDetectRenderer({width: 800, height: 600, antialias: true});
    this.ratio = 800 / 600;
    this.Stage = new PIXI.Container();
    this.Stage.x = 0;
    this.Stage.y = 0;
    this.Stage.width = 800;
    this.Stage.height = 600;
    this.ScalingRect.OnRequestRender.subscribe(() => {
      this.ForceRender();
    });
  }


  ngAfterViewInit(): void {
    this.pixiContainer.nativeElement.appendChild(this.Renderer.view);
    this.Renderer.render(this.Stage);
  }

  onTileResize(event) {
    // @ts-ignore
    const w = this.tilePixi._element.nativeElement.offsetWidth;
    // @ts-ignore
    const h = this.tilePixi._element.nativeElement.offsetHeight;

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
    this.Renderer.view.style.width = this.winWidth + 'px';
    this.Renderer.view.style.height = this.winHeight + 'px';
    this.Renderer.render(this.Stage);
  }


  onAddPoint() {
    const p = new Point({position: new PIXI.Point(400, 300)});
    p.SetName('myPoint');
    this.registerGeoEvents(p);
    p.Init();
    this.Geometries.push(p);
  }

  onAddRect() {
    const newRect = new Rect({
      width: 100, height: 100, center: true,
      position: new PIXI.Point(400, 300), style: this.rectStyle
    });
    newRect.SetName('myRect');
    this.registerGeoEvents(newRect);
    newRect.Init();
    this.Geometries.push(newRect);
  }

  onAddEllipse() {
    const newEllipse = new Ellipse({
      width: 100, height: 120, center: true, position: new PIXI.Point(400, 300),
      style: this.ellipseStyle
    });
    newEllipse.SetName('myEllipse');
    this.registerGeoEvents(newEllipse);
    newEllipse.Init();
    this.Geometries.push(newEllipse);
  }

  onAddLine() {
    const line = new Line({
      p1: new PIXI.Point(200, 300),
      p2: new PIXI.Point(400, 300),
      style: this.lineStyle
    });
    line.SetName('myLine');
    this.registerGeoEvents(line);
    line.Init();
    this.Geometries.push(line);
  }

  onAddPolyLine() {
    const midX = 400;
    const midY = 300;
    const offset = 100;
    const polyLine = new PolyLine({
      points: [
        new PIXI.Point(midX - offset, midY - offset),
        new PIXI.Point(midX + offset, midY - offset),

        new PIXI.Point(midX + offset, midY + offset),
        new PIXI.Point(midX - offset, midY + offset)
      ], style: this.polyLineStyle
    });
    polyLine.SetName('myPolyLine');
    this.registerGeoEvents(polyLine);
    polyLine.Init();
    this.Geometries.push(polyLine);
  }

  onAddPolygon() {
    const midX = 400;
    const midY = 300;
    const offset = 100;
    const polygon = new PolyGon({
      points: [
        new PIXI.Point(midX - offset, midY - offset),
        new PIXI.Point(midX + offset, midY - offset),

        new PIXI.Point(midX + offset, midY + offset),
        new PIXI.Point(midX - offset, midY + offset)
      ], style: this.polyGonStyle
    });
    polygon.SetName('myPolyGon');
    this.registerGeoEvents(polygon);
    polygon.Init();
    this.Geometries.push(polygon);
  }

  private registerGeoEvents(geo: IGeometry) {
    geo.OnRequestRender.subscribe({
      next: () => {
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
    geo.OnChange.subscribe(value => {
      this.changeEvents.push(value);
      if (this.changeEvents.length >= 2) {
        while (this.changeEvents.length > 2) {
          this.changeEvents.shift();
        }
      }
    });
  }

  onAddArrow() {
    this.myArrow = new ScaleArrow(ScaleDirection.Left);
    this.myArrow.Init(100, 100);
    this.onAddObject(this.myArrow.DispObj);
  }

  onAddTest() {
    this.modifyRect();
    this.modifyPoint();
    this.modifyLine();
    this.modifyEllipse();
    this.modifyPolyGon();
    this.modifyPolyLine();
  }

  modifyRect() {
    const rect = this.Geometries.find(value => value.GetName() === 'myRect');
    if (rect === undefined) {
      return;
    }
    const rectPoints = rect.GetPoints();
    rectPoints[0].x = 50;
    rectPoints[1].x = 500;
    rect.UpdatePoints(rectPoints);
    rect.EnableControls(false);
  }

  modifyPoint() {
    const p = this.Geometries.find(value => value.GetName() === 'myPoint');
    if (p === undefined) {
      return;
    }
    const points = p.GetPoints();
    points[0].x += 100;
    points[0].y += 50;
    p.UpdatePoints(points);
  }

  modifyLine() {
    const p = this.Geometries.find(value => value.GetName() === 'myLine');
    if (p === undefined) {
      return;
    }
    const points = p.GetPoints();
    points[0].x = 50;
    points[1].y = 450;
    p.UpdatePoints(points);
  }

  modifyEllipse() {
    const p = this.Geometries.find(value => value.GetName() === 'myEllipse');
    if (p === undefined) {
      return;
    }
    const points = p.GetPoints();
    points[1].x += 50;
    p.UpdatePoints(points);
  }

  modifyPolyGon() {
    const p = this.Geometries.find(value => value.GetName() === 'myPolyGon');
    if (p === undefined) {
      return;
    }
    const points = p.GetPoints();
    for (const pp of points) {
      pp.x += 10;
      pp.y += 10;
    }
    p.UpdatePoints(points);
  }

  modifyPolyLine() {
    const p = this.Geometries.find(value => value.GetName() === 'myPolyLine');
    if (p === undefined) {
      return;
    }
    const points = p.GetPoints();
    for (const pp of points) {
      pp.x += 10;
      pp.y += 10;
    }
    p.UpdatePoints(points);
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
