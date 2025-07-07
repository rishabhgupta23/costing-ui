import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorLandingComponent } from './components/vendor-landing/vendor-landing.component';
import { VendorFormComponent } from './components/vendor-form/vendor-form.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: VendorLandingComponent
  },
  {
    path: ":mode",
    canActivate: [AuthGuard],
    component: VendorFormComponent
  },
   {
     path: ':mode/:id',
     canActivate: [AuthGuard],
     component: VendorFormComponent
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
