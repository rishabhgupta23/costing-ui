import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartLandingComponent } from './components/part-landing/part-landing.component';
import { PartsFormComponent } from './components/parts-form/parts-form.component';

const routes: Routes = [
  {
    path: "",
    component: PartLandingComponent
  },
  {
    path: "create",
    component: PartsFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartsRoutingModule { }
