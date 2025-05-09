import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserFormComponent } from './components/user-form/user-form.component';
import { UserLandingComponent } from './components/user-landing/user-landing.component';

const routes: Routes = [
  {
    path: "",
    component: UserLandingComponent
  },
    {
      path: ":mode",
      component: UserFormComponent
    },
      {
         path: ':mode/:id', component: UserFormComponent 
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
