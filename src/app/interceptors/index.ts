import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { JwtInterceptor } from './jwt-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { LoaderInterceptor } from './loader-interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
];
