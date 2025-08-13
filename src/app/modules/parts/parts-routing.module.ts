import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartLandingComponent } from './components/part-landing/part-landing.component';
import { PartsFormComponent } from './components/parts-form/parts-form.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PartViewComponent } from './components/part-view/part-view.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { UserRole } from 'src/app/shared/constants/userrole.constants';

const routes: Routes = [
  {
    path: "",
    component: PartLandingComponent
  },
  {
    path: 'view/:id', component: PartViewComponent
  },
  {
    path: ":mode",
    canActivate: [AuthGuard],
    component: PartsFormComponent,
    data:{roles:[UserRole.SUPERADMIN,UserRole.ADMIN,UserRole.MAINTAINER]}
  },
  {
     path: ':mode/:id', 
     canActivate: [AuthGuard],
     component: PartsFormComponent,
     data:{roles:[UserRole.SUPERADMIN,UserRole.ADMIN,UserRole.MAINTAINER]}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), MatPaginatorModule],
  exports: [RouterModule, MatPaginatorModule],
})
export class PartsRoutingModule { }
