import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigLandingComponent } from './components/config-landing/config-landing.component';
import { CategoryComponent } from './components/category/category.component';
import { CostFactorComponent } from './components/cost-factor/cost-factor.component';

const routes: Routes = [
  {
    path: "",
    component: ConfigLandingComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  },
  {
    path: 'cost-factor',
    component: CostFactorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
