import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "",
        redirectTo: "vendors",
        pathMatch: "full"
      },
      {
        path: "vendors",
        loadChildren: () => import("../vendors/vendors.module").then((module) => module.VendorsModule)
      },
      {
        path: "parts",
        loadChildren: () => import("../parts/parts.module").then((module) => module.PartsModule)
      },
      {
        path: "calculate",
        loadChildren: () => import("../calculate/calculate.module").then((module) => module.CalculateModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
