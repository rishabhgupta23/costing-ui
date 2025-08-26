import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components/home/home.component';
import { CoreModule } from '../../core/core.module';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';


@NgModule({
  declarations: [ HomeComponent, UnauthorizedComponent ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CoreModule
  ]
})
export class HomeModule { }
