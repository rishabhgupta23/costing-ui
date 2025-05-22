import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigLandingComponent } from './components/config-landing/config-landing.component';
import { CategoryComponent } from './components/category/category.component';
import { PartAttributeComponent } from './components/part-attribute/part-attribute.component';
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
  },
  {
    path: 'part-attribute',
    component: PartAttributeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
