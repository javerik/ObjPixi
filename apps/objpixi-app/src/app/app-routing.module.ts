import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BasicComponent} from './examples/basic/basic.component';


const routes: Routes = [
  {path: 'basic', component: BasicComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
