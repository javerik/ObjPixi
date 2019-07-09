import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatGridTile} from '@angular/material';
import * as PIXI from 'pixi.js';
import {IGeometry} from '../../interface/igeometry';
import {DrawWizard} from '../../interaction/draw/draw-wizard';

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
  private ratio: number;
  private winWidth = 800;
  private winHeight = 600;

  constructor() { }

  ngOnInit() {
    this.Renderer = PIXI.autoDetectRenderer({width: 800, height: 600, antialias: true});
    this.ratio = 800 / 600;
    this.Stage = new PIXI.Container();
    this.Stage.x = 0;
    this.Stage.y = 0;
    this.Stage.width = 800;
    this.Stage.height = 600;
  }

  ngAfterViewInit(): void {
    this.pixiContainer.nativeElement.appendChild(this.Renderer.view);
    this.Renderer.render(this.Stage);
    this.Wizard = new DrawWizard();
    this.Wizard.Init(this.winWidth, this.winHeight, object => {
      this.Stage.addChild(object);
      this.ForceRender();
    });
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
