import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigLandingComponent } from './components/config-landing/config-landing.component';
import { CategoryComponent } from './components/category/category.component';

const routes: Routes = [
  {
    path: "",
    component: ConfigLandingComponent
  },
  {
    path: 'category',
    component: CategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
