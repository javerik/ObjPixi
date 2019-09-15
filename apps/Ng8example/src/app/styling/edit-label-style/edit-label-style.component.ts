import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FontFamilies, FontStyles, FontWeights, IStyleLabel} from 'objpixi-ng8-lib';
import {EditFillStyleComponent} from '../edit-fill-style/edit-fill-style.component';
import {connectableObservableDescriptor} from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-edit-label-style',
  templateUrl: './edit-label-style.component.html',
  styleUrls: ['./edit-label-style.component.css']
})
export class EditLabelStyleComponent implements OnInit, AfterViewInit {

  @Input() Style: IStyleLabel;
  @ViewChild(EditFillStyleComponent, {static: false}) fsComp: EditFillStyleComponent;

  BackgroundEnable = false;
  RoundCorner = false;

  constructor() {
  }

  Fonts = FontFamilies;
  FontKeys = Object.keys(FontFamilies);

  Weights = FontWeights;
  WeightKeys = Object.keys(FontWeights);

  Styles = FontStyles;
  StyleKeys = Object.keys(FontStyles);

  ngOnInit() {
    console.log(this.Style.textStyle.fontWeight);

  }

  onChanged(event) {
    console.log(event);
  }

  ngAfterViewInit(): void {
    if (this.fsComp === undefined) {
      console.error('SHIT');
    }
    // this.fsComp.SetStyle(this.Style.styleRect.fillStyle);
  }

  onBgEnable() {
    if (this.BackgroundEnable) {
    }
  }

}
