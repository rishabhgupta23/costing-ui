import { Routes } from '@angular/router';
import { ContactusComponent } from './shared/components/contactus/contactus.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginGuard } from './core/guards/login.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "app",
        pathMatch: "full"
    },
    {
        path: "app",
        canActivate: [AuthGuard],
        loadChildren: () => import("./modules/home/home.module").then((module) => module.HomeModule)
    },
    {
        path: "login",
          canActivate: [LoginGuard],
        loadChildren: () => import("./modules/login/login.module").then((module) => module.LoginModule)
    },
    {
        path: "contact-us",
        component: ContactusComponent

    }
];
