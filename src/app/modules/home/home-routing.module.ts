import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserRole } from 'src/app/shared/constants/userrole.constants';

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
      },
      {
        path: "config",
        canActivate: [AuthGuard],
        loadChildren: () => import("../config/config.module").then((module) => module.ConfigModule),
        data: { roles: [UserRole.SUPERADMIN, UserRole.ADMIN] }
      },
      {
        path: "users",
        canActivate: [AuthGuard],
        loadChildren: () => import("../setting/setting.module").then((module) => module.SettingModule),
        data: { roles: [UserRole.SUPERADMIN, UserRole.ADMIN] }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
