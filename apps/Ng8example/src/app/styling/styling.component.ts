import { Component, OnInit } from '@angular/core';
import {BasicComponent} from '../basic/basic.component';
import {IStyleFill} from 'objpixi-ng8-lib';

@Component({
  selector: 'app-styling',
  templateUrl: './styling.component.html',
  styleUrls: ['./styling.component.css']
})
export class StylingComponent extends BasicComponent implements OnInit {

  constructor() {
    super();
  }

  FillStyle: IStyleFill = {
    lineColor: 0xd81b60,
    useFill: false,
    useLine: true,
    fillAlpha: 0,
    fillColor: 0,
    lineAlpha: 0,
    lineWidth: 5
  };

  ngOnInit() {
    super.ngOnInit();
  }
  
  onStyleChanged(event) {
    console.log(event);
  }

}
