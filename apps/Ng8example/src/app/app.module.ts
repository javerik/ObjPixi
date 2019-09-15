import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BasicComponent} from './basic/basic.component';
import {MatButtonToggleModule, MatGridListModule, MatSlideToggleModule} from '@angular/material';
import { StylingComponent } from './styling/styling.component';
import { EditFillStyleComponent } from './styling/edit-fill-style/edit-fill-style.component';
import {FormsModule} from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { ColorConverterPipe } from './pipes/color-converter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    BasicComponent,
    StylingComponent,
    EditFillStyleComponent,
    ColorConverterPipe
  ],
  imports: [
    BrowserModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatSlideToggleModule,
    FormsModule,
    ColorPickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
