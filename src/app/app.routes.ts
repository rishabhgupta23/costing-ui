import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "app",
        pathMatch: "full"
    },
    {
        path: "app",
        loadChildren: () => import("./modules/home/home.module").then((module) => module.HomeModule)
    },
    {
        path: "login",
        loadChildren: () => import("./modules/login/login.module").then((module) => module.LoginModule)
    }
];
