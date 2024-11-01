import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { environment } from '@environments';
import { apiInterceptor } from './core/interceptors';
import { mockBackendInterceptor } from './core/interceptors';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        apiInterceptor,
        ...(environment.BASE_URL === '' ? [mockBackendInterceptor] : []),
      ]),
    ),
  ],
};
