import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculateComponent } from './components/calculate/calculate.component';
import { ToolsDashboardComponent } from './components/tools-dashboard/tools-dashboard.component';
import { ProductionPlanComponent } from './components/production-plan/production-plan.component';
import { ProductionPlanExitGuard } from 'src/app/core/guards/production-plan-exit.guard';

const routes: Routes = [
  {
    path: "",
    component: ToolsDashboardComponent,
    children: [
      {
        path: "",
        redirectTo: "calculate",
        pathMatch: "full"
      },
      {
        path: 'calculate',
        component: CalculateComponent
      },
      {
        path: 'production-plan',
        component: ProductionPlanComponent,
        canDeactivate: [ProductionPlanExitGuard] 
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
