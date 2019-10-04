import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IStyleFill} from 'objpixi-ng8-lib';
import {ColorConverterPipe} from '../../pipes/color-converter.pipe';
import {ColorPickerService} from 'ngx-color-picker';
import {DefaultStyles} from '../default-styles';

@Component({
  selector: 'app-edit-fill-style',
  templateUrl: './edit-fill-style.component.html',
  styleUrls: ['./edit-fill-style.component.css']
})
export class EditFillStyleComponent implements OnInit {

  @Input() Style: IStyleFill;
  public LineColor = '#0';
  public FillColor = '#0';

  // region Events
  @Output() styleChanged: EventEmitter<[ColorDrawType, IStyleFill]> = new EventEmitter();
  // endregion

  ToggleLineColor = false;
  ToggleFillColor = false;
  CDT = ColorDrawType;

  CPipe = new ColorConverterPipe();

  BtnCss = ['btn', 'btn-block', 'btn-outline-primary'];

  constructor(private cpService: ColorPickerService) {
  }

  ngOnInit() {
    if (this.Style === undefined) {
      this.Style = DefaultStyles.FillStyle;
    }
    console.log(this.CPipe.transform(this.Style.lineColor));
    console.log(this.CPipe.transform(this.Style.fillColor));
    this.LineColor = '#' + this.CPipe.transform(this.Style.lineColor);
    this.FillColor = '#' + this.CPipe.transform(this.Style.fillColor);
  }

  SetStyle(style: IStyleFill) {
    this.Style = style;
    console.log(style);
    this.ngOnInit();
  }

  setColorPicker(event, type: ColorDrawType = ColorDrawType.Line) {
    if (type === ColorDrawType.Line) {
      this.LineColor = '#' + event.target.value;
    } else {
      this.FillColor = '#' + event.target.value;
    }
    this.styleChanged.emit([type, this.Style]);
  }

  OnLineStyleToggle() {
    if (this.Style.useLine && !this.Style.lineWidth) {
      this.Style.lineWidth = 1;
    }
  }

  public OnColorChanged(color: string, type: ColorDrawType = ColorDrawType.Line): string {
    const numColor = parseInt(('0x' + color.slice(1, color.length - 2)), 16);
    const fAlpha = parseInt(('0x' + color.slice(color.length - 2, color.length)), 16) / (255 / 100) / 100;
    if (type === ColorDrawType.Line) {
      this.Style.lineColor = numColor;
      this.Style.lineAlpha = fAlpha;
    } else {
      this.Style.fillColor = numColor;
      this.Style.fillAlpha = fAlpha;
    }
    this.styleChanged.emit([type, this.Style]);
    return '';
  }

  onLineWidthChanged() {
    this.styleChanged.emit([ColorDrawType.Line, this.Style]);
  }

}

export enum ColorDrawType {
  Line,
  Fill
}
