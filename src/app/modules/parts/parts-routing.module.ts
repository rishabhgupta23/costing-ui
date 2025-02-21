import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartLandingComponent } from './components/part-landing/part-landing.component';
import { PartsFormComponent } from './components/parts-form/parts-form.component';
import { MatPaginatorModule } from '@angular/material/paginator';

const routes: Routes = [
  {
    path: "",
    component: PartLandingComponent
  },
  {
    path: ":mode",
    component: PartsFormComponent
  },
  { path: ':mode/:id', component: PartsFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes), MatPaginatorModule],
  exports: [RouterModule, MatPaginatorModule],
})
export class PartsRoutingModule { }
