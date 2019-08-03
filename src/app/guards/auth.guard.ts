import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private AuthService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.AuthService.getAuthToken()) {
            this.AuthService.logIn();
            return true;
        } else {
            this.AuthService.removeAuthToken();
            this.AuthService.logOut();
            this.router.navigate(['/']);

            return false;
        }
    }
}