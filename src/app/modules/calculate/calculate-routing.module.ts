import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculateComponent } from './components/calculate/calculate.component';

const routes: Routes = [
  {
    path: "",
    component: CalculateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculateRoutingModule { }
