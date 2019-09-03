import {Subject} from 'rxjs';
import * as PIXI from 'pixi.js';
import {IGeometry} from '../interface/igeometry';
import {UUID} from 'angular2-uuid';
import {ChangeEvent} from '../interface/events/change-event';
import {ILabel} from '../interface/info/ilabel';
import {DummyLabel} from '../interaction/info/dummy-label';
import {ITexId} from '../interface/itex-id';
import {GeometryType} from '../interface/enums/geometry-type.enum';

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
  protected labelOffset: PIXI.Point = null;
  protected Type: GeometryType = GeometryType.Point;
  public TextureIds: Array<ITexId> = [];


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
    this.labelOffset = new PIXI.Point(0, 0);
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

  protected setLabelPosition() {
  }

  // region IGeometry
  public SetLabel(label: ILabel): void {
    this.Label = label;
    this.registerLabelEvents();
    this.Label.Init(this.Name);
    this.setLabelPosition();
  }

  public GetId(): string {
    return this.Id;
  }

  public GetName(): string {
    return this.Name;
  }

  public GetTextureIds(): Array<ITexId> {
    return [];
  }

  SetName(name: string) {
    this.Name = name;
    this.Label.SetText(this.Name);
  }

  public GetType(): GeometryType {
    return this.Type;
  }

  public GetLabel(): ILabel {
    return this.Label;
  }

  // endregion
}

export interface GeoEvent {
  target: IGeometry;
  event: PIXI.interaction.InteractionEvent;
}
