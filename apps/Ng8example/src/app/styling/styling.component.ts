import {Component, OnInit} from '@angular/core';
import {BasicComponent} from '../basic/basic.component';
import {IStyleFill, IStyleLabel} from 'objpixi-ng8-lib';
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

  ngOnInit() {
    super.ngOnInit();
  }

  onStyleChanged(event) {
  }

}
