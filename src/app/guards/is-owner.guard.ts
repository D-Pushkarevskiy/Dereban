import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { AppComponent } from '../app.component';

@Injectable({ providedIn: 'root' })
export class IsOwnerGuard implements CanActivate {
    API_URL = this.app.API_URL;

    constructor(
        private app: AppComponent,
        private router: Router,
        private http: HttpClient
    ) { }

    canActivate(activateRoute: ActivatedRouteSnapshot) {
        return Boolean(this.http.get(this.API_URL + '?func=is_owner&id=' + activateRoute.params['id']).subscribe(response => {
            if (!response) {
                this.router.navigate(['/']);
            }
            return response;
        }));
    }
}