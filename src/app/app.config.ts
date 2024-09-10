import { ApplicationConfig, importProvidersFrom, Provider, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './core/interceptors/auth/auth-interceptor';

export const authInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(), 
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
    authInterceptorProvider
  ]
};
