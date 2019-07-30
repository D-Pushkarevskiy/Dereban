import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private AuthService: AuthService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let authToken = this.AuthService.getAuthorizationToken();
        if (authToken && authToken !== '') {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${authToken}`
                }
            });
        }

        return next.handle(request);
    }
}