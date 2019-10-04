import {Component, OnInit} from '@angular/core';
import {BasicComponent} from '../basic/basic.component';
import {GeometryType, IGeometry, IStyleFill, IStyleLabel, IStyleRect} from 'objpixi-ng8-lib';
import {DefaultStyles} from './default-styles';

@Component({
  selector: 'app-styling',
  templateUrl: './styling.component.html',
  styleUrls: ['./styling.component.css']
})
export class StylingComponent extends BasicComponent implements OnInit {

  constructor() {
    super();
  }
  FillStyle = DefaultStyles.FillStyle;
  LabelStyle = DefaultStyles.LabelStyle;
  CurrentGeoType: GeometryType = null;
  GeoTypes = GeometryType;
  CurrentStyle: any = null;
  CurrentGeo: IGeometry = null;

  ngOnInit() {
    super.ngOnInit();
    this.OnGeoAdded.subscribe(value => {
      this.parseStyle(value);
    });
  }

  onStyleChanged(event) {
    this.CurrentGeo.SetStyle(this.CurrentStyle);
  }

  private parseStyle(geo: IGeometry) {
    this.CurrentGeo = geo;
    this.CurrentGeoType = geo.GetType();
    switch (geo.GetType()) {
      case GeometryType.Point:
        break;
      case GeometryType.Ellipse:
        break;
      case GeometryType.EllipseFill:
        break;
      case GeometryType.Line:
        break;
      case GeometryType.Rect:
        break;
      case GeometryType.RectFill:
        const tmpStyle: IStyleRect = geo.GetStyle();
        this.CurrentStyle = tmpStyle;
        this.FillStyle = tmpStyle.fillStyle;
        break;
      case GeometryType.Polygon:
        break;
      case GeometryType.Polyline:
        break;

    }
  }

}
