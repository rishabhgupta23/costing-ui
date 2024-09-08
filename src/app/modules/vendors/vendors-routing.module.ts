import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorLandingComponent } from './components/vendor-landing/vendor-landing.component';
import { VendorFormComponent } from './components/vendor-form/vendor-form.component';

const routes: Routes = [
  {
    path: "",
    component: VendorLandingComponent
  },
  {
    path: "create",
    component: VendorFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorsRoutingModule { }
