import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BasicComponent} from './examples/basic/basic.component';
import {WizardComponent} from './examples/wizard/wizard.component';


const routes: Routes = [
  {path: 'basic', component: BasicComponent},
  {path: 'wizard', component: WizardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
