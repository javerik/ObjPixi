import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js';
import {Rect} from '../../geometries/Rect/rect';
import {GeoEvent} from '../../geometries/base-geo';
import InteractionEventTypes = PIXI.interaction.InteractionEventTypes;


@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit, AfterViewInit {

  @ViewChild('pixiContainer', {static: false}) pixiContainer: ElementRef;
  App: PIXI.Application;
  Renderer: PIXI.Renderer;
  Stage: PIXI.Container;
  myRect: Rect;

  private ratio: number;

  constructor() {
  }

  ngOnInit() {
    this.Renderer = PIXI.autoDetectRenderer({width: 800, height: 600});
    this.App = new PIXI.Application({width: 800, height: 600});
    this.Stage = new PIXI.Container();
  }

  ngAfterViewInit(): void {
    this.pixiContainer.nativeElement.appendChild(this.App.view);
  }

  onAddRect() {
    this.myRect = new Rect({width: 100, height: 100, center: true, position: new PIXI.Point(400, 300)});
    this.myRect.OnRequestRender.subscribe({
      next: value => {
        this.App.render();
      }
    });
    this.myRect.OnInitialized.subscribe({
      next: value => {
        this.onAddObject(value);
      }
    });
    this.myRect.OnInteraction.subscribe({
      next: value => {
        this.onObjectEvent(value);
      }
    });
    this.myRect.Init();
  }

  onAddObject(obj: PIXI.DisplayObject) {
    this.App.stage.addChild(obj);
  }

  onObjectEvent(event: GeoEvent) {
    console.log('Event from [%s]- %s type: %s', event.target.GetId(), event.target.GetName(), event.event.type);

    switch (event.event.type) {
      case 'click':
        console.log('Clicked');
        break;
    }
  }

}
