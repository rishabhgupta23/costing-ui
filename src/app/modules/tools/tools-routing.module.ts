import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculateComponent } from './components/calculate/calculate.component';
import { ToolsDashboardComponent } from './components/tools-dashboard/tools-dashboard.component';
import { ProductionPlanComponent } from './components/production-plan/production-plan.component';

const routes: Routes = [
  {
    path: "",
    component: ToolsDashboardComponent,
    children: [
      {
        path: 'calculate',
        component: CalculateComponent,
        outlet: 'calculate',
      },
      {
        path: 'production-plan',
        component: ProductionPlanComponent,
        outlet: 'productionPlan',
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
