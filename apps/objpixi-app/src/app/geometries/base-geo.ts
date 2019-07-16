import {Subject} from 'rxjs';
import * as PIXI from 'pixi.js';
import {IGeometry} from '../interface/igeometry';
import { UUID } from 'angular2-uuid';
import {ChangeEvent} from '../interface/events/change-event';
import {ILabel} from '../interface/info/ilabel';
import {DummyLabel} from '../interaction/info/dummy-label';

export class BaseGeo {

  public OnRequestRender: Subject<null>;
  public OnInitialized: Subject<PIXI.DisplayObject>;
  public OnInteraction: Subject<GeoEvent>;
  public OnChange: Subject<ChangeEvent>;
  protected Id: string;
  protected Name: string;
  protected GContainer: PIXI.Container;
  protected LabelContainer: PIXI.Container;
  protected enableControl = true;
  protected Label: ILabel;

  constructor(name?: string) {
    this.Id = UUID.UUID();
    if (name === undefined) {
      this.Name = '';
    } else {
      this.Name = name;
    }
    this.OnRequestRender = new Subject();
    this.OnInitialized = new Subject();
    this.OnInteraction = new Subject();
    this.OnChange = new Subject();
    this.Label = new DummyLabel();
    this.LabelContainer = new PIXI.Container();
  }

  protected registerLabelEvents() {
    this.Label.OnInitialized.subscribe(value => {
      this.LabelContainer.removeChildren();
      this.LabelContainer.addChild(value);
    });
    this.Label.OnRequestRender.subscribe(value => {
      this.OnRequestRender.next();
    });
  }
  // region IGeometry
  public SetLabel(label: ILabel): void {
    this.Label = label;
    this.registerLabelEvents();
    this.Label.Init();
  }

  public GetId(): string {
    return this.Id;
  }

  public GetName(): string {
    return this.Name;
  }

  SetName(name: string) {
    this.Name = name;
    this.Label.SetText(this.Name);
  }

  // endregion
}

export interface GeoEvent {
  target: IGeometry;
  event: PIXI.interaction.InteractionEvent;
}
