import { Routes } from '@angular/router';
import { HomeModule } from './modules/home/home.module';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "app",
        pathMatch: "full"
    },
    {
        path: "app",
        loadChildren: () => import("./modules/home/home.module").then((module) => module.HomeModule)
    }
];
