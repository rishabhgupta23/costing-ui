import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigLandingComponent } from './components/config-landing/config-landing.component';
import { CategoryComponent } from './components/category/category.component';
import { PartAttributeComponent } from './components/part-attribute/part-attribute.component';

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
    path: 'part-attribute',
    component: PartAttributeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
