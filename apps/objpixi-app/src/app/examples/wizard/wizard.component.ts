import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatGridTile} from '@angular/material';
import * as PIXI from 'pixi.js';
import {IGeometry} from '../../interface/igeometry';
import {DrawWizard} from '../../interaction/draw/draw-wizard';
import {GeometryType} from '../../interface/enums/geometry-type.enum';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit, AfterViewInit {

  @ViewChild('pixiContainer', {static: false}) pixiContainer: ElementRef;
  @ViewChild('tilePixi', {static: false}) tilePixi: MatGridTile;
  Renderer: PIXI.Renderer;
  Stage: PIXI.Container;
  Wizard: DrawWizard;
  Geometries: Array<IGeometry> = [];
  AvailableTypes: Array<GeometryType> = [GeometryType.Point];
  GeometryTypes = GeometryType;
  private ratio: number;
  private winWidth = 640;
  private winHeight = 512;

  constructor() { }

  ngOnInit() {
    this.Renderer = PIXI.autoDetectRenderer({width: this.winWidth, height: this.winHeight, antialias: true});
    this.ratio = this.winWidth / this.winHeight;
    this.Stage = new PIXI.Container();
    this.Stage.x = 0;
    this.Stage.y = 0;
    this.Stage.width = this.winWidth;
    this.Stage.height = this.winHeight;
  }

  ngAfterViewInit(): void {
    this.pixiContainer.nativeElement.appendChild(this.Renderer.view);
    this.Renderer.render(this.Stage);
    this.Wizard = new DrawWizard();
    this.Wizard.Init(this.winWidth, this.winHeight, object => {
      this.Stage.addChild(object);
      this.ForceRender();
    });
    this.Wizard.OnRequestRender.subscribe(value => {
      this.ForceRender();
    });
  }

  changeGeometry(type: GeometryType) {
    this.Wizard.SetGeometryType(type);
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

  ForceRender() {
    this.Renderer.render(this.Stage);
  }

}
